<?php

namespace App\DataFixtures;

use App\Entity\Asset;
use App\Entity\ViewAsset;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class ViewAssetFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $assets = $manager->getRepository(Asset::class)->findAll();
        $view   = $this->getReference(ViewFixtures::VIEW_CV_REFERENCE);

        foreach ($assets as $asset) {
            $viewAsset = new ViewAsset();

            $viewAsset->setAsset($asset);
            $viewAsset->setView($view);

            $manager->persist($viewAsset);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            AssetFixtures::class,
            ViewFixtures::class,
        );
    }
}
