<?php

namespace App\Controller;

use App\Entity\Content;
use App\Entity\View;
use App\Entity\ViewAsset;
use App\Entity\ViewContent;
use App\Form\ViewType;
use App\Model\AssetModel;
use App\Model\ContentModel;
use App\Model\ViewModel;
use Doctrine\Common\Collections\Criteria;
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

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
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
        ]);
    }

    /**
     * @Route("/admin/list-view", name="view_list", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function list()
    {
        $views = $this->em->getRepository(View::class)->findAll();

        foreach ($views as $view) {
            $titles[] = [
                'id'    => $view->getId(),
                'name'  => $view->getName(),
                'title' => $view->getTitle(),
            ];
        }

        return new JsonResponse(\json_encode($titles));
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
     * Update view
     *
     * Update a view
     *
     * @Route("/admin/view/{id}", name="view_update", methods={"PUT", "PATCH"})
     *
     * @param  string $id
     * @return Response
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
        }

        return new JsonResponse(json_encode('data received'));
    }
}
