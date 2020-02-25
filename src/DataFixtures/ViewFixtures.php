<?php

namespace App\DataFixtures;

/* use App\Entity\User; */
use App\Entity\View;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class ViewFixtures extends Fixture implements DependentFixtureInterface
{
    public const VIEW_CV_REFERENCE = 'view-cv';

    public function load(ObjectManager $manager)
    {
        $view = new View();
        /* $user = $manager->getRepository(User::class)->findOneBy(['email' => 'test@test.com']); */
        $user = $this->getReference(UserFixtures::USER_TEST);

        $view->setUser($user);
        $view->setName('cv');
        $view->setTitle('Xavier Laviron');
        $view->setCreatedAt(date_create());
        $manager->persist($view);

        $manager->flush();

        $this->addReference(self::VIEW_CV_REFERENCE, $view);
    }

    public function getDependencies()
    {
        return array(
            UserFixtures::class,
        );
    }
}
