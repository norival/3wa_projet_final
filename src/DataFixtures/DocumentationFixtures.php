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
        $loremMessage1 =
            'Overview: Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Collections are a group of contents.';
        $loremMessage2 =
            'Details: Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Collections are a group of contents.';
        $documentation->setName('collection')
                      ->setLocale('en')
                      ->setContent([
                          'overview' => [
                              'name'    => 'Collection management',
                              'content' => $loremMessage1,
                          ],
                          'details' => [
                              'name'    => 'Collection details',
                              'content' => $loremMessage2,
                          ],
                      ]);
        $manager->persist($documentation);

        $documentation = new Documentation();
        $documentation->setName('general')
                      ->setLocale('en')
                      ->setContent([
                          'overview' => [
                              'name'    => 'Administration panel',
                              'content' => $loremMessage1,
                          ],
                          'actions' => [
                              'name'    => 'Available actions',
                              'content' => $loremMessage2,
                          ],
                      ]);
        $manager->persist($documentation);

        $documentation = new Documentation();
        $documentation->setName('content')
                      ->setLocale('en')
                      ->setContent([
                          'overview' => [
                              'name'    => 'Content management',
                              'content' => $loremMessage1,
                          ],
                          'actions' => [
                              'name'    => 'Content details',
                              'content' => $loremMessage2,
                          ],
                      ]);
        $manager->persist($documentation);

        $manager->flush();
    }
}
