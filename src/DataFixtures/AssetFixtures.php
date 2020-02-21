<?php

namespace App\DataFixtures;

use App\Entity\Asset;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AssetFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $asset = new Asset();

        $asset->setName('Test Image');
        $asset->setFileType('image');
        $asset->setDescription('An image to test assets management');
        $asset->setSource('images/test_image.jpg');
        $asset->setCreatedAt(\date_create());

        $manager->persist($asset);
        $manager->flush();
    }
}
