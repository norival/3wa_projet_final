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
    public function index(SettingManager $sm)
    {
        return $this->render('admin/index.html.twig', [
            'siteName' => $sm->get('site_name'),
        ]);
    }
}
