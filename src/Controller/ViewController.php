<?php

namespace App\Controller;

use App\Entity\Content;
use App\Entity\View;
use App\Model\ViewModel;
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
        // get the view from the db
        $view = $em->getRepository(View::class)->findOneBy(['name' => $name]);

        // get the content needed to render the view from the db
        $content = $em->getRepository(Content::class)->findBy([
            'type' => $view->getContentType(),
        ]);

        // create a new ViewModel which is used in the template
        $viewModel = new ViewModel();
        // bind content to the ViewModel
        $viewModel->bindContent($content);

        return $this->render("view/$name.html.twig", [
            'title'     => $view->getTitle(),
            'viewModel' => $viewModel,
        ]);
    }
}
