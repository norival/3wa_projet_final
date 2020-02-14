<?php

namespace App\Controller;

use App\Entity\Content;
use App\Entity\View;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ViewController extends AbstractController
{
    /**
     * @Route("/{locale}/{name}", name="view")
     */
    public function index(EntityManagerInterface $em, string $locale, string $name)
    {
        $view = $em->getRepository(View::class)->findOneBy(['name' => $name]);
        /* dump($view->getContentType()); */
        $content = $em->getRepository(Content::class)->findBy([
            'type' => $view->getContentType(),
        ]);
        dump($content);

        return $this->render("view/$name.html.twig", [
            'content' => $content,
        ]);
    }
}
