<?php

namespace App\Repository;

use App\Entity\ViewContent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ViewContent|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewContent|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewContent[]    findAll()
 * @method ViewContent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewContent::class);
    }

    public function findByViewIdJoined($viewId)
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
            FROM App\Entity\ViewContent vc
            INNER JOIN vc.content c
            WHERE vc.view = :viewId'
            )->setParameter('viewId', $viewId);

        return $query->getResult();
    }
}
