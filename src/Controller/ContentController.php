<?php

namespace App\Controller;

use App\Entity\Content;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContentController extends AbstractController
{
    /**
     * @Route("/{route}", name="content")
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function index(Request $request, string $route)
    {
        // get entity manager
        $em = $this->getDoctrine()->getManager();

        // get content from db
        $content = $em->getRepository(Content::class)->findOneBy(['route' => $route]);

        // not found exception if the page does not exist
        if (!$content) {
            throw $this->createNotFoundException('This page does not exist');
        }

        dump($content->getContent());

        return $this->render("content/$route.html.twig", [
            'controller_name' => 'ContentController',
            'content'         => $content,
            'resume'          => $content->getContent()['resume'],
        ]);
    }
}
