<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ViewAssetRepository")
 */
class ViewAsset
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\View", inversedBy="viewAssets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $view;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Asset", inversedBy="viewAssets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $asset;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getView(): ?View
    {
        return $this->view;
    }

    public function setView(?View $view): self
    {
        $this->view = $view;

        return $this;
    }

    public function getAsset(): ?Asset
    {
        return $this->asset;
    }

    public function setAsset(?Asset $asset): self
    {
        $this->asset = $asset;

        return $this;
    }
}
