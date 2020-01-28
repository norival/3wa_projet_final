<?php

namespace App\DataFixtures;

use App\Entity\Content;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ContentFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $content = new Content();
        $content->setTitle('CV');
        $content->setRoute('cv');
        $content->setCreatedAt(date_create());
        $content->setContent([
            'Experiences' => [
                [
                    'title'   => 'First experience',
                    'content' => 'First experience content',
                ],
                [
                    'title'   => 'Second experience',
                    'content' => 'Second experience content',
                ],
            ],
            'Training' => [
                [
                    'title'   => 'First training',
                    'content' => 'First training content',
                ],
                [
                    'title'   => 'Second training',
                    'content' => 'Second training content',
                ],
            ]
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setTitle('Projects');
        $content->setRoute('projects');
        $content->setCreatedAt(date_create());
        $content->setContent([
            'Projects' => [
                [
                    'title'   => 'First project',
                    'content' => 'First project',
                ],
                [
                    'title'   => 'Second project',
                    'content' => 'Second project',
                ],
            ],
        ]);
        $manager->persist($content);

        $manager->flush();
    }
}
