<?php

namespace App\Repository;

use App\Entity\ViewAsset;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ViewAsset|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewAsset|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewAsset[]    findAll()
 * @method ViewAsset[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewAssetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewAsset::class);
    }

    // /**
    //  * @return ViewAsset[] Returns an array of ViewAsset objects
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
    public function findOneBySomeField($value): ?ViewAsset
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
