<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ContentRepository")
 */
class Content
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"form"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"form"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(type="array")
     */
    private $content = [];

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updated_at;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ViewContent", mappedBy="content")
     */
    private $viewContents;

    public function __construct()
    {
        $this->viewContents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getContent(): ?array
    {
        return $this->content;
    }

    public function setContent(array $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeInterface $updated_at): self
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function __get(string $name)
    {
        return $this->content[$name];
    }

    public function __isset(string $name)
    {
        return array_key_exists($name, $this->content);
    }

    /**
     * @return Collection|ViewContent[]
     */
    public function getViewContents(): Collection
    {
        return $this->viewContents;
    }

    public function addViewContent(ViewContent $viewContent): self
    {
        if (!$this->viewContents->contains($viewContent)) {
            $this->viewContents[] = $viewContent;
            $viewContent->setContent($this);
        }

        return $this;
    }

    public function removeViewContent(ViewContent $viewContent): self
    {
        if ($this->viewContents->contains($viewContent)) {
            $this->viewContents->removeElement($viewContent);
            // set the owning side to null (unless already changed)
            if ($viewContent->getContent() === $this) {
                $viewContent->setContent(null);
            }
        }

        return $this;
    }
}
