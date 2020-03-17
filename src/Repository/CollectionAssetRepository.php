<?php

namespace App\Repository;

use App\Entity\CollectionAsset;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CollectionAsset|null find($id, $lockMode = null, $lockVersion = null)
 * @method CollectionAsset|null findOneBy(array $criteria, array $orderBy = null)
 * @method CollectionAsset[]    findAll()
 * @method CollectionAsset[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CollectionAssetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CollectionAsset::class);
    }

    public function findByCollectionIdJoined($collectionId)
    {
        $em = $this->getEntityManager();

        $query = $em->createQuery(
            'SELECT
                a.id,
                a.name,
                a.description,
                a.file_type,
                a.source,
                a.created_at
            FROM App\Entity\CollectionAsset ca
            INNER JOIN ca.asset a
            WHERE ca.collection = :collectionId'
            )->setParameter('collectionId', $collectionId);

        return $query->getArrayResult();
    }
}
