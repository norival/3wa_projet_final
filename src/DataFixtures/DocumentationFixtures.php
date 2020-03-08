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
        $loremMessage =
            'Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Views are a group of contents.';
        $documentation->setName('view')
                      ->setLocale('en')
                      ->setContent([
                          'overview' => [
                              'name'    => 'View management',
                              'content' => $loremMessage,
                          ],
                          'details' => [
                              'name'    => 'View details',
                              'content' => $loremMessage,
                          ],
                      ]);
        $manager->persist($documentation);

        $documentation = new Documentation();
        $documentation->setName('general')
                      ->setLocale('en')
                      ->setContent([
                          'overview' => [
                              'name'    => 'Administration panel',
                              'content' => $loremMessage,
                          ],
                          'actions' => [
                              'name'    => 'Available actions',
                              'content' => $loremMessage,
                          ],
                      ]);
        $manager->persist($documentation);

        $manager->flush();
    }
}
