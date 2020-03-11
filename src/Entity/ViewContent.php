<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ViewContentRepository")
 */
class ViewContent
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"default", "form"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\View", inversedBy="viewContents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $view;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Content", inversedBy="viewContents")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"default", "form"})
     */
    private $content;

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

    public function getContent(): ?Content
    {
        return $this->content;
    }

    public function setContent(?Content $content): self
    {
        $this->content = $content;

        return $this;
    }
}
