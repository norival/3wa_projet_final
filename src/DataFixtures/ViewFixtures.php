<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\View;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ViewFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $view = new View();
        $user = $manager->getRepository(User::class)->findOneBy(['email' => 'test@test.com']);

        $view->setUser($user);
        $view->setName('cv');
        $view->setTitle('Xavier Laviron');
        $view->setCreatedAt(date_create());
        $manager->persist($view);

        $manager->flush();
    }
}
