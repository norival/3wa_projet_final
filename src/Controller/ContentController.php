<?php

namespace App\Controller;

use App\Entity\Content;
use App\Form\ContentType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        return $this->render("content/$route.html.twig", [
            'content' => $content->getContent(),
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

    /**
     * @Route("/{route}", name="content_update", methods={"POST"})
     *
     * @param  Request $request
     * @param  string $route
     * @return Response
     */
    public function update(Request $request, string $route)
    {
        $content = $this->em->getRepository(Content::class)->findOneBy(['route' => $route]);
        $form = $this->createForm(ContentType::class, $content);

        \dump($content);
    }


    /**
     * @Route("/admin/list-content", name="content_list", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function list()
    {
        $contents = $this->em->getRepository(Content::class)->findAll();

        foreach ($contents as $content) {
            $titles[] = [
                'title' => $content->getTitle(),
                'route' => $content->getRoute(),
            ];
        }

        return new JsonResponse($titles);
    }
}
