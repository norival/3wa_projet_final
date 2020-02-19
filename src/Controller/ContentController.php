<?php

namespace App\Controller;

use App\Entity\Content;
use App\Form\ContentType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContentController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/{route}", name="content")
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
     * @Route("/{route}", name="content_update", methods={"POST"})
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function update(Request $request, string $route)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['route' => $route]);
        $form = $this->createForm(ContentType::class, $content);

        \dump($content);
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
            $names[] = $item->getName();
        }

        return new JsonResponse($names);
    }

    public function extra($parameter)
    {
        return new Response($parameter);
    }
}
