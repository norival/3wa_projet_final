<?php

namespace App\Controller;

use App\Entity\View;
use App\Entity\ViewAsset;
use App\Entity\ViewContent;
use App\Form\ViewType;
use App\Model\AssetModel;
use App\Model\ContentModel;
use App\Repository\ViewRepository;
use App\Service\Paginator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ViewController extends AbstractController
{
    private $em;
    private $serializer;
    private $viewRepository;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        ViewRepository $repo
    )
    {
        $this->em             = $em;
        $this->serializer     = $serializer;
        $this->viewRepository = $repo;
    }

    /**
     * @Route("/{locale}/{name}", name="view", requirements={"locale"="[a-z]{2}"})
     */
    public function index(string $locale, string $name)
    {
        /* TODO: the join returns an array with the content. It whould be better if it returned
         * an array of Content objects (for the templates). If it is not possible, try to implement
         * custom filter/function for twig
         */

        // get the view from the db
        $view = $this->em->getRepository(View::class)->findOneBy(['name' => $name]);

        // use models to simplify templating
        $contentModel = new ContentModel(
            $this->em->getRepository(ViewContent::class)->findByViewIdJoined($view->getId())
        );
        $assetModel = new AssetModel(
            $this->em->getRepository(ViewAsset::class)->findByViewIdJoined($view->getId())
        );

        return $this->render("view/$name.html.twig", [
            'title'        => $view->getTitle(),
            'contentModel' => $contentModel,
            'assetModel'   => $assetModel,
            'admin'        => false,
        ]);
    }

    /**
     * @Route("/admin/view/visual/{id}", name="view_admin_visual", requirements={"id"="\d+"})
     *
     * Renders a view from a template to be used in admin UI
     *
     * @param int $id The id of the view
     */
    public function renderVisualAdmin(int $id)
    {
        // get the view from the db
        $view = $this->em->getRepository(View::class)->findOneBy(['id' => $id]);
        $name = $view->getName();

        // use models to simplify templating
        $contentModel = new ContentModel(
            $this->em->getRepository(ViewContent::class)->findByViewIdJoined($view->getId())
        );
        $assetModel = new AssetModel(
            $this->em->getRepository(ViewAsset::class)->findByViewIdJoined($view->getId())
        );

        return $this->render("view/$name.html.twig", [
            'title'        => $view->getTitle(),
            'contentModel' => $contentModel,
            'assetModel'   => $assetModel,
            'admin'        => true,
        ]);
    }



    /**
     * List all the available views (with pagination) and return result as JSON data
     *
     * @Route("/view/list", name="view_list", methods={"GET"})
     *
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @param  Request $request
     * @return JsonResponse
     */
    public function list(Paginator $paginator, SerializerInterface $serializer, Request $request)
    {
        // get query from repository
        $listQuery = $this->viewRepository->list(true);

        // paginate results
        $paginator->paginate(
            $listQuery,
            $request->query->getInt('page', 1),
            $request->query->getInt('itemsPerPage', 5)
        );

        // serialize results
        $json = $serializer->serialize(
            [
                'state'   => $paginator->getState(),
                'results' => $paginator->getResults(),
            ],
            'json',
            ['groups' => 'list']
        );

        return JsonResponse::fromJsonString($json, 200);
    }

    /**
     * Search available views by name
     *
     * @Route("/view/search", name="view_search", methods="GET")
     *
     * @param  Request $request
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @return JsonResponse
     */
    public function searchByName(Request $request, Paginator $paginator, SerializerInterface $serializer): JsonResponse
    {
        $searchQuery = $this->viewRepository->searchByName($request->query->get('name'));

        $paginator->paginate(
            $searchQuery,
            1,
            $request->query->getInt('itemsPerPage', 10)
        );

        $json = $serializer->serialize(
            [
                'state'   => $paginator->getState(),
                'results' => $paginator->getResults(),
            ],
            'json',
            ['groups' => 'list']
        );

        return JsonResponse::fromJsonString($json);
    }

    /**
     * getForm
     *
     * Get the view information and send it to the admin as JSON data
     *
     * @Route("/admin/view/form/{id}", name="view_get_form", methods={"GET"})
     *
     * @param  string $name
     * @return Response
     */
    public function getForm(SerializerInterface $serializer, string $id)
    {
        // get the view object
        $view = $this->em->getRepository(View::class)->findOneBy(['id' => $id]);
        $json = $serializer->serialize($view, 'json', ['groups' => 'form']);

        return new JsonResponse($json);
    }

    /**
     * Get a view by its id
     *
     * @Route("/view/{id}", name="view_get", requirements={"id"="\d+"})
     *
     * @param  int $id
     * @return JsonResponse
     */
    public function get(string $id): JsonResponse
    {
        $view = $this->viewRepository->find($id);
        $json = $this->serializer->serialize(
            $view,
            'json',
            ['groups' => 'default']
        );

        return JsonResponse::fromJsonString($json);
    }

    /**
     * Update view
     *
     * Update a view
     *
     * @Route("/admin/view/{id}", name="view_update", methods={"PUT", "PATCH"})
     *
     * @param  string $id
     * @return JsonResponse The 
     */
    public function update(Request $request, string $id)
    {
        $view = $this->em->getRepository(View::class)->findOneBy(['id' => $id]);
        $form = $this->createForm(ViewType::class, $view);

        $data = json_decode($request->getContent(), true);
        $form->submit($data, false);

        if ($form->isValid()) {
            $view->setUpdatedAt(date_create());

            $this->em->persist($view);
            $this->em->flush();

            // TODO set location header to link the updated resource
            // send the id of the updated view
            return new JsonResponse(\json_encode($view->getId()), 200);
        }

        // TODO useful error message
        $errorMessage = 'The data is not valid';
        return new JsonResponse(\json_encode($errorMessage), 400);
    }
}
