<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(): RedirectResponse
    {
        return $this->redirectToRoute('collection_render', [
            'locale' => 'en',
            'name'   => 'cv',
        ]);
    }
}
