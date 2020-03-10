<?php

namespace App\Controller;

use App\Entity\Content;
use App\Form\ContentType;
use App\Repository\ContentRepository;
use App\Service\Paginator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/*
 * TODO
 * Set location headers for responses
 */
class ContentController extends AbstractController
{
    /** @var \Doctrine\ORM\EntityManagerInterface $em */
    private $em;
    private $contentRepository;

    public function __construct(EntityManagerInterface $em, ContentRepository $repo)
    {
        $this->em                = $em;
        $this->contentRepository = $repo;
    }

    /**
     * @Route("/content/list", name="content_list", methods={"GET"})
     *
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @param  Request $request
     * @return JsonResponse
     */
    public function list(Paginator $paginator, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $listQuery = $this->contentRepository->list(true);

        // paginate results
        $paginator->paginate(
            $listQuery,
            $request->query->getInt('page', 1),
            $request->query->getInt('itemsPerPage', 10)
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
     * Delete a content from the database
     *
     * @Route("/admin/content/{id}", name="content_delete", methods={"DELETE"}, requirements={"id"="\d+"})
     *
     * @return JsonResponse
     */
    public function delete(int $id)
    {
        $content = $this->em->getRepository(Content::class)->find($id);

        if ($content) {
            $this->em->remove($content);
            $this->em->flush();
        }

        return new JsonResponse(null, 204);
    }

    /**
     * @Route("/admin/content/form/{id}", name="content_get_form", methods={"GET"}, requirements={"id"="\d+"})
     *
     * @return Response
     */
    public function getForm(SerializerInterface $serializer, $id)
    {
        // TODO get only one column from db
        $content = $this->em->getRepository(Content::class)->findOneBy(['id' => $id]);

        $json = $serializer->serialize($content, 'json', [
            'groups' => 'content_form',
        ]);

        return new Response($json);
    }

    /**
     * @Route("/admin/content/{id}", name="content_get", methods={"GET"}, requirements={"id"="\d+"})
     *
     * @return JsonResponse
     */
    public function getById(SerializerInterface $serializer, $id)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['id' => $id]);

        $json = $serializer->serialize($content, 'json', [
            'groups' => 'default',
        ]);

        return new JsonResponse($json);
    }

    /**
     * Create a new content
     *
     * @Route("/admin/content", name="content_new", methods={"POST"})
     *
     * @param  Request $request
     * @return JsonResponse
     */
    public function new(Request $request)
    {
        $content = new Content();
        $form = $this->createForm(ContentType::class, $content);

        $data = \json_decode($request->getContent(), true);
        $form->submit($data, false);

        if ($form->isValid()) {
            // TODO if object has not been modified, do not change updated_at field
            $content->setCreatedAt(\date_create());

            $this->em->persist($content);
            $this->em->flush();

            // return if of newly created content
            return new JsonResponse(\json_encode($content->getId(), 201));
        }

        // TODO useful error message
        $errorMessage = 'The data is not valid';
        return new JsonResponse(\json_encode($errorMessage), 400);
    }

    /**
     * @Route("/admin/content/{id}", name="content_update", methods={"PUT"}, requirements={"id"="\d+"})
     *
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['id' => $id]);
        $form = $this->createForm(ContentType::class, $content);

        $data = json_decode($request->getContent(), true);
        $form->submit($data, false);

        if ($form->isValid()) {
            // TODO if object has not been modified, do not change updated_at field
            $content->setUpdatedAt(date_create());

            $this->em->persist($content);
            $this->em->flush();
        }

        return new JsonResponse(json_encode('data received'));
    }

    /**
     * Search available content by name
     *
     * @Route("/content/search", name="content_search", methods="GET")
     *
     * @param  Request $request
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @return JsonResponse
     */
    public function searchByName(Request $request, Paginator $paginator, SerializerInterface $serializer): JsonResponse
    {
        $searchQuery = $this->contentRepository->searchByName($request->query->get('name'));

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
}
