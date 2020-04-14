<?php

namespace App\DataFixtures;

use App\Entity\Content;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class ContentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        /** @var \App\Entity\User $user */
        $user = $this->getReference(UserFixtures::USER_TEST);

        $loremMessage =
            'Overview: Amet tenetur sequi tempore minus nam velit doloribus culpa excepturi! Consequuntur quas sint aperiam libero iure. Consectetur ut placeat amet voluptate in vero ut. Assumenda impedit aut aspernatur commodi fugiat?Views are a group of contents.';

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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
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
        $content->setUser($user);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('phd');
        $content->setType('experience');
        $content->setContent([
            'name'        => 'PhD in Ecology',
            'place'       => 'Grenoble',
            'description' => 'A PhD in Ecology',
            'year_start'  => '2017',
            'year_end'    => '2019',
        ]);
        $content->setUser($user);
        $manager->persist($content);

        $content = new Content();
        $content->setCreatedAt(date_create());
        $content->setName('theiar');
        $content->setType('realisation');
        $content->setContent([
            'name'        => 'theiaR',
            'description' => 'R library blabla',
            'year'        => '2019',
            'link'        => 'https://cran.r-project.org/package=theiaR',
            'link_text'   => 'theiaR',
        ]);
        $content->setUser($user);
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
        $content->setUser($user);
        $manager->persist($content);

        // other dummy content
        for ($i = 1; $i <= 100; $i++) {
            $content = new Content();
            $content->setCreatedAt(date_create());
            $content->setName("dummy_content_$i");
            $content->setType('dummy');
            $content->setContent([
                'name'        => 'My dummy content ' . $i,
                'description' => $loremMessage,
            ]);
            $content->setUser($user);
            $manager->persist($content);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            UserFixtures::class,
        );
    }
}
