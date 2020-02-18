<?php

namespace App\Controller;

use App\Entity\Content;
use App\Entity\View;
use App\Form\ViewType;
use App\Model\ViewModel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ViewController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/{locale}/{name}", name="view", requirements={"locale"="[a-z]{2}"})
     */
    public function index(string $locale, string $name)
    {
        // get the view from the db
        $view = $this->em->getRepository(View::class)->findOneBy(['name' => $name]);

        // get the content needed to render the view from the db
        $content = $this->em->getRepository(Content::class)->findBy([
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

    /**
     * @Route("/admin/list-view", name="view_list", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function list()
    {
        $views = $this->em->getRepository(View::class)->findAll();

        foreach ($views as $view) {
            $titles[] = [
                'name'  => $view->getName(),
                'title' => $view->getTitle(),
            ];
        }

        return new JsonResponse($titles);
    }

    /**
     * getForm
     *
     * Get the view form to render it in the javascript admin
     *
     * @Route("/admin/view/form/{name}", name="view_get_form", methods={"GET"})
     *
     * @param  string $name
     * @return Response
     */
    public function getForm(string $name)
    {
        // get the view object
        $view = $this->em->getRepository(View::class)->findOneBy(['name' => $name]);

        // create a form
        $form = $this->createForm(ViewType::class, $view);

        // render the form from template and send the response
        return $this->render("view/form.html.twig", [
            'form' => $form->createView(),
        ]);
    }
}
