<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;

class JsRouterController extends AbstractController
{
    /**
     * @Route("/booter", name="booter")
     */
    public function index(RouterInterface $router)
    {
        dump($router);

        // get entity manager
        return new JsonResponse(json_encode([
            'content'         => 'content',
            'controller_name' => 'AdminController',
        ]));
    }
}
