<?php

namespace App\Controller;

use App\Entity\Documentation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/doc", methods={"GET"}, requirements={"locale"="[a-z]{2}"})
 */
class DocumentationController extends AbstractController
{
    private $em;
    private $serializer;

    public function __construct(EntityManagerInterface $em, SerializerInterface $serializer)
    {
        $this->em         = $em;
        $this->serializer = $serializer;
    }

    /**
     * Get documentation by name
     *
     * @param string $locale The locale
     * @param string $name The name of the documentation to get
     * @return JsonResponse
     *
     * @Route("/{locale}/{name}", name="documentation_get_by_name", methods={"GET"})
     */
    public function getByName(string $locale, string $name)
    {
        $doc = $this->em->getRepository(Documentation::class)->findOneBy([
            'locale' => $locale,
            'name'   => $name,
        ]);

        if (!$doc) {
            $errorMessage = 'The requested documentation does not exist';

            return new JsonResponse($errorMessage, 404);
        }

        $response = JsonResponse::fromJsonString(
            $this->serializer->serialize($doc->getContent(), 'json'),
            200
        );

        return $response;
    }
}
