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

    // /**
    //  * @return ViewContent[] Returns an array of ViewContent objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('v.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ViewContent
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
