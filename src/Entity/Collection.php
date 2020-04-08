<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as ORMCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\CollectionContent;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CollectionRepository")
 */
class Collection
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"default", "form", "list"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"default", "form", "list"})
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"default", "form", "list"})
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"default", "form", "list"})
     */
    private $updated_at;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"default", "form", "list"})
     */
    private $title;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="collections")
     * @Groups({"default", "form", "list"})
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CollectionContent", mappedBy="collection", orphanRemoval=true, cascade={"persist"})
     * @Groups({"default", "form"})
     */
    private $collectionContents;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CollectionAsset", mappedBy="collection", orphanRemoval=true)
     */
    private $collectionAssets;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"default"})
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"default", "form", "list"})
     */
    private $locale;

    public function __construct()
    {
        $this->collectionContents = new ArrayCollection();
        $this->collectionAssets = new ArrayCollection();
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
     * @return ORMCollection|CollectionContent[]
     */
    public function getCollectionContents(): ORMCollection
    {
        return $this->collectionContents;
    }

    public function addCollectionContent(CollectionContent $collectionContent): self
    {
        if (!$this->collectionContents->contains($collectionContent)) {
            $this->collectionContents[] = $collectionContent;
            $collectionContent->setCollection($this);
        }

        return $this;
    }

    public function removeCollectionContent(CollectionContent $collectionContent): self
    {
        if ($this->collectionContents->contains($collectionContent)) {
            $this->collectionContents->removeElement($collectionContent);
            // set the owning side to null (unless already changed)
            if ($collectionContent->getCollection() === $this) {
                $collectionContent->setCollection(null);
            }
        }

        return $this;
    }

    /**
     * @return ORMCollection|CollectionAsset[]
     */
    public function getCollectionAssets(): ORMCollection
    {
        return $this->collectionAssets;
    }

    public function addCollectionAsset(CollectionAsset $collectionAsset): self
    {
        if (!$this->collectionAssets->contains($collectionAsset)) {
            $this->collectionAssets[] = $collectionAsset;
            $collectionAsset->setCollection($this);
        }

        return $this;
    }

    public function removeCollectionAsset(CollectionAsset $collectionAsset): self
    {
        if ($this->collectionAssets->contains($collectionAsset)) {
            $this->collectionAssets->removeElement($collectionAsset);
            // set the owning side to null (unless already changed)
            if ($collectionAsset->getCollection() === $this) {
                $collectionAsset->setCollection(null);
            }
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function setLocale(?string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }
}
