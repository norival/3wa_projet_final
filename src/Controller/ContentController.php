<?php

namespace App\Controller;

use App\Entity\Content;
use App\Form\ContentType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ContentController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/admin/content", name="content_list", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function list()
    {
        // TODO get only one column from db
        $content = $this->em->getRepository(Content::class)->findAll();

        foreach ($content as $item) {
            $data[] = [
                'name'       => $item->getName(),
                'type'       => $item->getType(),
                'id'         => $item->getId(),
                'created_at' => $item->getCreatedAt(),
            ];
        }

        return new JsonResponse(\json_encode($data));
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
     * @Route("/admin/content", name="content_new", methods={"POST"})
     *
     * @return JsonResponse
     */
    public function new(Request $request)
    {
        /* $content = $this->em->getRepository(Content::class)->findOneBy(['id' => $id]); */
        $content = new Content();
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
     * @Route("/content/search", name="content_search", methods={"GET"})
     *
     * Search a content's id and name by its name
     *
     * @return JsonResponse
     */
    public function searchByName(Request $request)
    {
        $contentList = $this->em->getRepository(Content::class)->searchByName($request->get('search'));

        return new JsonResponse(\json_encode($contentList));
    }
}
