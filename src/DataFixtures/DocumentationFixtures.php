<?php

namespace App\DataFixtures;

use App\Entity\Documentation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class DocumentationFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $documentation = new Documentation();

        $documentation->setName('view')
                      ->setLocale('en')
                      ->setContent([
                          'Overview' => 'Views are a group of contents',
                          'Dtails'   => 'Blabla blabla bla blablabla bla blablabla blabla bla',
                      ]);
        $manager->persist($documentation);

        $manager->flush();
    }
}
