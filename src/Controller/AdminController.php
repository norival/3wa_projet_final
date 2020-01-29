<?php

namespace App\Controller;

use App\Entity\Content;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        // get entity manager
        $em = $this->getDoctrine()->getManager();

        $content = $em->getRepository(Content::class)->findAll();
        dump($content);
        return $this->render('admin/index.html.twig', [
            'content'         => $content,
            'controller_name' => 'AdminController',
        ]);
    }
}
