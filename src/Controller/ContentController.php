<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContentController extends AbstractController
{
    /**
     * @Route("/{route}", name="content")
     */
    public function index(Request $request, string $route)
    {
        return $this->render('content/index.html.twig', [
            'controller_name' => 'ContentController',
        ]);
    }
}
