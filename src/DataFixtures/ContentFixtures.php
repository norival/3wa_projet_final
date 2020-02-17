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
        $content->setCreatedAt(date_create());
        $content->setName('cv_header');
        $content->setType('cv_header');
        $content->setContent([
            'title'    => 'Xavier Laviron',
            'subtitle' => 'Full stack web developer',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('latex');
        $content->setType('skill');
        $content->setContent([
            'name'    => 'LaTeX',
            'level'   => 'expert',
            'section' => 'technical',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('php');
        $content->setType('skill');
        $content->setContent([
            'name'    => 'PHP',
            'level'   => 'beginner',
            'section' => 'technical',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('php');
        $content->setType('skill');
        $content->setContent([
            'name'    => 'PHP',
            'level'   => 'beginner',
            'section' => 'web',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('php');
        $content->setType('skill');
        $content->setContent([
            'name'    => 'Javascript',
            'level'   => 'beginner',
            'section' => 'web',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('english');
        $content->setType('skill');
        $content->setContent([
            'name'    => 'English',
            'level'   => 'fluent',
            'section' => 'other',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('fac');
        $content->setType('training');
        $content->setContent([
            'name'        => 'MsC biology',
            'place'       => 'Dijon',
            'description' => 'Ecology blabla',
            'year'        => '2017',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('3wa');
        $content->setType('training');
        $content->setContent([
            'name'        => '3W Academy',
            'place'       => 'Grenoble',
            'description' => 'Intensive training in web development',
            'year'        => '2019',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('internship');
        $content->setType('experience');
        $content->setContent([
            'name'        => 'Internship in Ecology',
            'place'       => 'Dijon',
            'description' => 'An internship in Ecology',
            'year_start'  => '2017',
            'year_end'    => null,
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('phd');
        $content->setType('experience');
        $content->setContent([
            'name'        => 'PhD in Ecology',
            'place'       => 'Grenoble',
            'description' => 'A PhD in Ecology is boring',
            'year_start'  => '2017',
            'year_end'    => '2019',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('theiar');
        $content->setType('realisation');
        $content->setContent([
            'name'        => 'theiaR',
            'description' => 'R library blabla',
            'year'        => '2019',
        ]);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('misc');
        $content->setType('book');
        $content->setContent([
            'name'        => 'My book',
            'description' => 'My book about writing a book',
            'year'        => '2017',
        ]);
        $manager->persist($content);

        $manager->flush();
    }
}
