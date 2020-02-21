<?php

namespace App\Controller;

use App\Entity\Asset;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AssetController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/admin/asset", name="asset_list")
     *
     * @return JsonResponse
     */
    public function list()
    {
        $assets = $this->em->getRepository(Asset::class)->findAll();

        foreach ($assets as $asset) {
            $data[] = [
                'id'        => $asset->getId(),
                'file_type' => $asset->getFileType(),
                'name'      => $asset->getName(),
            ];
        }

        return new JsonResponse($data);
    }
}
