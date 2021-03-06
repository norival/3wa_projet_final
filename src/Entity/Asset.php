<?php

namespace App\Entity;

use App\Entity\CollectionAsset;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as ORMCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AssetRepository")
 */
class Asset
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $file_type;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $source;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="assets")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CollectionAsset", mappedBy="asset")
     */
    private $collectionAssets;

    public function __construct()
    {
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getFileType(): ?string
    {
        return $this->file_type;
    }

    public function setFileType(string $file_type): self
    {
        $this->file_type = $file_type;

        return $this;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(string $source): self
    {
        $this->source = $source;

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
            $collectionAsset->setAsset($this);
        }

        return $this;
    }

    public function removeCollectionAsset(CollectionAsset $collectionAsset): self
    {
        if ($this->collectionAssets->contains($collectionAsset)) {
            $this->collectionAssets->removeElement($collectionAsset);
            // set the owning side to null (unless already changed)
            if ($collectionAsset->getAsset() === $this) {
                $collectionAsset->setAsset(null);
            }
        }

        return $this;
    }
}
