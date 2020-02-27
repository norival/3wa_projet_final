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
     * @Route("/content/{route}", name="content")
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function index(Request $request, string $route)
    {
        // get content from db
        $content = $this->em->getRepository(Content::class)->findOneBy(['route' => $route]);

        // not found exception if the page does not exist
        if (!$content) {
            throw $this->createNotFoundException('This page does not exist');
        }

        $content2 = new Content();
        $content2->getContent();
        $content2->setTitle('title');
        $content2->setRoute('newroute');
        $content2->setCreatedAt(\date_create());

        $form = $this->createForm(ContentType::class, $content2);

        dump($form->createView());

        return $this->render("content/$route.html.twig", [
            'content' => $content->getContent(),
        ]);
    }

    /**
     * @Route("/admin/content/form/{route}", name="content_get_form", methods={"GET"})
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function getForm(Request $request, string $route)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['route' => $route]);
        $form = $this->createForm(ContentType::class, $content);

        return $this->render("content/{$route}_form.html.twig", [
            'form' => $form->createView(),
        ]);
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
     * @Route("/admin/content/{id}", name="content_get", methods={"GET"}, requirements={"id"="\d+"})
     *
     * @return Response
     */
    public function getById(SerializerInterface $serializer, $id)
    {
        // TODO get only one column from db
        $content = $this->em->getRepository(Content::class)->findOneBy(['id' => $id]);
        \dump($content);

        $json = $serializer->serialize($content, 'json', [
            'groups' => 'content_form',
        ]);

        return new Response($json);
    }

    /**
     * @Route("/admin/content/{id}", name="content_update", methods={"PUT"}, requirements={"id"="\d+"})
     *
     * @return Response
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
}
