<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ViewRepository")
 */
class View
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
     * @ORM\Column(type="datetime")
     * @Groups({"form"})
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"form"})
     */
    private $updated_at;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"form"})
     */
    private $title;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="views")
     * @Groups({"form"})
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ViewContent", mappedBy="view", orphanRemoval=true, cascade={"persist"})
     * @Groups({"form"})
     */
    private $viewContents;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ViewAsset", mappedBy="view", orphanRemoval=true)
     */
    private $viewAssets;

    public function __construct()
    {
        $this->viewContents = new ArrayCollection();
        $this->viewAssets = new ArrayCollection();
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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
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
            $viewContent->setView($this);
        }

        return $this;
    }

    public function removeViewContent(ViewContent $viewContent): self
    {
        if ($this->viewContents->contains($viewContent)) {
            $this->viewContents->removeElement($viewContent);
            // set the owning side to null (unless already changed)
            if ($viewContent->getView() === $this) {
                $viewContent->setView(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ViewAsset[]
     */
    public function getViewAssets(): Collection
    {
        return $this->viewAssets;
    }

    public function addViewAsset(ViewAsset $viewAsset): self
    {
        if (!$this->viewAssets->contains($viewAsset)) {
            $this->viewAssets[] = $viewAsset;
            $viewAsset->setView($this);
        }

        return $this;
    }

    public function removeViewAsset(ViewAsset $viewAsset): self
    {
        if ($this->viewAssets->contains($viewAsset)) {
            $this->viewAssets->removeElement($viewAsset);
            // set the owning side to null (unless already changed)
            if ($viewAsset->getView() === $this) {
                $viewAsset->setView(null);
            }
        }

        return $this;
    }
}
