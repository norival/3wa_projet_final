<?php

namespace App\Entity;

use App\Entity\CollectionContent;
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
     * @Groups({"default", "form", "content_form", "list"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"default", "form", "content_form", "list"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"form", "default", "content_form", "list"})
     */
    private $type;

    /**
     * @ORM\Column(type="array")
     * @Groups({"default", "content_form"})
     */
    private $content = [];

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"default", "list"})
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"default", "list"})
     */
    private $updated_at;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CollectionContent", mappedBy="content", cascade="remove")
     */
    private $collectionContents;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="contents")
     * @Groups({"default", "list"})
     */
    private $user;

    public function __construct()
    {
        $this->collectionContents = new ArrayCollection();
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
     * @return Collection|CollectionContent[]
     */
    public function getCollectionContents(): Collection
    {
        return $this->collectionContents;
    }

    public function addCollectionContent(CollectionContent $collectionContent): self
    {
        if (!$this->collectionContents->contains($collectionContent)) {
            $this->collectionContents[] = $collectionContent;
            $collectionContent->setContent($this);
        }

        return $this;
    }

    public function removeCollectionContent(CollectionContent $collectionContent): self
    {
        if ($this->collectionContents->contains($collectionContent)) {
            $this->collectionContents->removeElement($collectionContent);
            // set the owning side to null (unless already changed)
            if ($collectionContent->getContent() === $this) {
                $collectionContent->setContent(null);
            }
        }

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
}
