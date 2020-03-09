<?php

namespace App\Service;

use App\Entity\Setting;
use Doctrine\ORM\EntityManagerInterface;

/**
 * SettingManager
 *
 * Service that helps in managing website settings
 *
 * @author Xavier Laviron <xavier@norival.dev>
 */
class SettingManager
{
    /** @var \Doctrine\ORM\EntityManagerInterface $em */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Get a setting value by its name
     *
     * @param  string $name
     * @return mixed The value of the requested setting
     */
    public function get(string $name)
    {
        return $this->em->getRepository(Setting::class)->findOneBy(['name' => $name])->getValue();
    }
}
