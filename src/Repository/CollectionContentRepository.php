<?php

namespace App\Repository;

use App\Entity\CollectionContent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CollectionContent|null find($id, $lockMode = null, $lockVersion = null)
 * @method CollectionContent|null findOneBy(array $criteria, array $orderBy = null)
 * @method CollectionContent[]    findAll()
 * @method CollectionContent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CollectionContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CollectionContent::class);
    }

    public function findByCollectionIdJoined($collectionId)
    {
        $em = $this->getEntityManager();

        $query = $em->createQuery(
            'SELECT
                c.id,
                c.name,
                c.type,
                c.content,
                c.created_at,
                c.updated_at
            FROM App\Entity\CollectionContent cc
            INNER JOIN cc.content c
            WHERE cc.collection = :collectionId'
            )->setParameter('collectionId', $collectionId);

        return $query->getResult();
    }
}
