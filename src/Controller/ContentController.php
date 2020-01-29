<?php

namespace App\Controller;

use App\Entity\Content;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

        dump($content->getContent());

        return $this->render("content/$route.html.twig", [
            'content'         => $content,
            'resume'          => $content->getContent()['resume'],
        ]);
    }

    /**
     * @Route("/admin/page/{route}", name="content_admin")
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function showAdmin(Request $request, string $route)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['route' => $route]);

        return $this->render("content/admin.html.twig", [
            'content' => $content,
            'route'   => $route,
        ]);
    }
}
