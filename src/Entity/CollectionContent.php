<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\Collection;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CollectionContentRepository")
 */
class CollectionContent
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"default", "form"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Collection", inversedBy="collectionContents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $collection;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Content", inversedBy="collectionContents")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"default", "form"})
     */
    private $content;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCollection(): ?Collection
    {
        return $this->collection;
    }

    public function setCollection(?Collection $collection): self
    {
        $this->collection = $collection;

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
