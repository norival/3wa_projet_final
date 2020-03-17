<?php

namespace App\DataFixtures;

use App\Entity\Asset;
use App\Entity\CollectionAsset;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class CollectionAssetFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $assets     = $manager->getRepository(Asset::class)->findAll();
        $collection = $this->getReference(CollectionFixtures::COLLECTION_CV_REFERENCE);

        foreach ($assets as $asset) {
            $collectionAsset = new CollectionAsset();

            $collectionAsset->setAsset($asset);
            $collectionAsset->setCollection($collection);

            $manager->persist($collectionAsset);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            AssetFixtures::class,
            CollectionFixtures::class,
        );
    }
}
