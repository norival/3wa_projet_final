<?php

namespace App\DataFixtures;

use App\Entity\View;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ViewFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        $view = new View();
        $view->setName('cv');
        $view->setCreatedAt(date_create());
        $view->setContentType([
            'skill',
            'experience',
        ]);
        $manager->persist($view);

        $manager->flush();
    }
}
