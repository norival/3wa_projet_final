<?php

namespace App\DataFixtures;

use App\Entity\Content;
use App\Entity\Collection;
use App\Entity\CollectionContent;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\MakerBundle\Resources\skeleton\doctrine\Fixtures;

class CollectionContentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $contents = $manager->getRepository(Content::class)->findAll();
        $collection     = $this->getReference(CollectionFixtures::COLLECTION_CV_REFERENCE);

        foreach ($contents as $content) {
            $collectionContent = new CollectionContent();
            if ($content->getName() === 'misc') {
                continue;
            }

            $collectionContent->setContent($content);
            $collectionContent->setCollection($collection);

            $manager->persist($collectionContent);
        }

        $collection = $this->getReference(CollectionFixtures::COLLECTION_TEST_REFERENCE);
        foreach ($contents as $content) {
            $collectionContent = new CollectionContent();
            if ($content->getName() !== 'php') {
                continue;
            }

            $collectionContent->setContent($content);
            $collectionContent->setCollection($collection);

            $manager->persist($collectionContent);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            ContentFixtures::class,
            CollectionFixtures::class,
        );
    }
}
