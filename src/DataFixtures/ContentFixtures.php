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
            'informations' => [
                'title'    => 'Xavier Laviron',
                'subtitle' => 'Fullstack web developer',
            ],
            'skills' => [
                'Web' => [
                    'php',
                    'mysql',
                    'html',
                ],
                'Technical' => [
                    'R',
                    'LaTeX',
                ],
            ],
            'experiences' => [
                [
                    'date'    => '2019',
                    'title'   => 'First experience',
                    'place'   => 'First experience place',
                    'content' => 'First experience content',
                ],
                [
                    'date'    => '2019',
                    'title'   => 'First experience',
                    'place'   => 'First experience place',
                    'content' => 'First experience content',
                ],
            ],
            'training' => [
                [
                    'date'    => '2019',
                    'title'   => 'First training',
                    'place'   => 'First training place',
                    'content' => 'First training content',
                ],
                [
                    'date'    => '2019',
                    'title'   => 'First training',
                    'place'   => 'First training place',
                    'content' => 'First training content',
                ],
            ],
            'realisations' => [
                [
                    'date'    => '2019',
                    'title'   => 'First project',
                    'content' => 'First project content',
                ],
                [
                    'date'    => '2019',
                    'title'   => 'First project',
                    'content' => 'First project content',
                ],
            ],
            'contact' => [
                'mail' => 'xavier@norival.dev',
            ],
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setTitle('Projects');
        $content->setRoute('projects');
        $content->setCreatedAt(date_create());
        $content->setContent([
            'informations' => [
                'title'   => 'My projects',
            ],
            'projects' => [
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
