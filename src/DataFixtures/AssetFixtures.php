<?php

namespace App\DataFixtures;

use App\Entity\Asset;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AssetFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        for ($i = 1; $i < 5; $i++) {
            $asset = new Asset();

            $asset->setName("Test Image $i");
            $asset->setFileType('image');
            $asset->setDescription("An image to test assets management $i");
            $asset->setSource('images/test_image.jpg');
            $asset->setCreatedAt(\date_create());

            $manager->persist($asset);
        }

        $manager->flush();
    }
}
