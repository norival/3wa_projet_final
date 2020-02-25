<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    public const USER_TEST = 'user-test';
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setEmail('test@test.com');
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'password'
        ));
        $manager->persist($user);

        $userAdmin = new User();
        $userAdmin->setEmail('admin@test.com');
        $userAdmin->setRoles(['ROLE_ADMIN']);
        $userAdmin->setPassword($this->passwordEncoder->encodePassword(
            $userAdmin,
            'admin_password'
        ));
        $manager->persist($userAdmin);

        $manager->flush();

        $this->addReference(self::USER_TEST, $user);
    }
}
