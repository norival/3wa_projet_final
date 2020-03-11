<?php

namespace App\DataFixtures;

use App\Entity\Content;
use App\Entity\View;
use App\Entity\ViewContent;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\MakerBundle\Resources\skeleton\doctrine\Fixtures;

class ViewContentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $contents = $manager->getRepository(Content::class)->findAll();
        $view     = $this->getReference(ViewFixtures::VIEW_CV_REFERENCE);

        foreach ($contents as $content) {
            $viewContent = new ViewContent();
            if ($content->getName() === 'misc') {
                continue;
            }

            $viewContent->setContent($content);
            $viewContent->setView($view);

            $manager->persist($viewContent);
        }

        $view = $this->getReference(ViewFixtures::VIEW_TEST_REFERENCE);
        foreach ($contents as $content) {
            $viewContent = new ViewContent();
            if ($content->getName() !== 'php') {
                continue;
            }

            $viewContent->setContent($content);
            $viewContent->setView($view);

            $manager->persist($viewContent);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            ContentFixtures::class,
            ViewFixtures::class,
        );
    }
}
