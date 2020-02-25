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

    /* SELECT v.id, a.name, a.description, a.source */
    /* FROM view AS v */
    /* INNER JOIN view_asset AS va ON v.id = va.view_id */
    /* INNER JOIN asset AS a ON a.id = va.asset_id */
    /* WHERE v.name = 'cv' */
    public function findByViewIdJoined($viewId)
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
            FROM App\Entity\ViewAsset va
            INNER JOIN va.asset a
            WHERE va.view = :viewId'
            )->setParameter('viewId', $viewId);

        return $query->getArrayResult();
    }
}
