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
        $content->setName('phd');
        $content->setType('experience');
        $content->setContent([
            'name'        => 'PhD in Ecology',
            'description' => 'A PhD in Ecology is boring',
            'year_start'  => '2017',
            'year_end'    => '2019',
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
