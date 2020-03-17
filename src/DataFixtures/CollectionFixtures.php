<?php

namespace App\DataFixtures;

use App\Entity\Collection;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class CollectionFixtures extends Fixture implements DependentFixtureInterface
{
    public const COLLECTION_CV_REFERENCE = 'collection-cv';
    public const COLLECTION_TEST_REFERENCE = 'collection-test';

    public function load(ObjectManager $manager)
    {
        $loremMessage =
            'Overview: Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Collections are a group of contents.';

        $collection = new Collection();
        $user = $this->getReference(UserFixtures::USER_TEST);

        $collection->setUser($user);
        $collection->setName('cv');
        $collection->setTitle('Xavier Laviron');
        $collection->setDescription($loremMessage);
        $collection->setCreatedAt(date_create());
        $manager->persist($collection);

        $loremMessage =
            'Overview: Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Collections are a group of contents.';

        $collectionTest = new Collection();
        $user = $this->getReference(UserFixtures::USER_TEST);

        $collectionTest->setUser($user);
        $collectionTest->setName('test');
        $collectionTest->setTitle('Test Collection');
        $collectionTest->setDescription($loremMessage);
        $collectionTest->setCreatedAt(date_create());
        $manager->persist($collectionTest);

        for ($i = 1; $i < 200; $i++) {
            $collectionDemo = new Collection();
            $user = $this->getReference(UserFixtures::USER_TEST);

            $date = date_create();
            $interval = rand(1, 11111);
            $interval = "P{$interval}D";
            $dateInterval = new \DateInterval($interval);
            $dateInterval->invert = 1;
            $date->add($dateInterval);

            $collectionDemo->setUser($user);
            /* $collectionDemo->setName("demoCollection_$i"); */
            $collectionDemo->setName(uniqid('collection_'));
            $collectionDemo->setTitle("Demo collection $i");
            $collectionDemo->setDescription($loremMessage);
            $collectionDemo->setCreatedAt($date);
            $manager->persist($collectionDemo);
        }

        $manager->flush();

        $this->addReference(self::COLLECTION_CV_REFERENCE, $collection);
        $this->addReference(self::COLLECTION_TEST_REFERENCE, $collectionTest);
    }

    public function getDependencies()
    {
        return array(
            UserFixtures::class,
        );
    }
}
