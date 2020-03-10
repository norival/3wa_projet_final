<?php

namespace App\Repository;

use App\Entity\View;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @method View|null find($id, $lockMode = null, $lockVersion = null)
 * @method View|null findOneBy(array $criteria, array $orderBy = null)
 * @method View[]    findAll()
 * @method View[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, View::class);
    }

    /**
     * Return the query to get a list of available views
     *
     * @param bool $joinUser Whether to join the users informations or not
     * @return QueryBuilder
     */
    public function list(bool $joinUser = true): QueryBuilder
    {
        $qb = $this->createQueryBuilder('v')
                   ->orderBy('v.created_at', 'DESC');

        if ($joinUser) {
            $qb->innerJoin('v.user', 'u');
        }

        return $qb;
    }

    /**
     * Search a view by its name and return the QueryBuilder for use with the
     * pagination
     *
     * @param  string $name The name to look for in the database
     *
     * @return QueryBuilder
     */
    public function searchByName(string $name): QueryBuilder
    {
        $qb = $this->createQueryBuilder('v')
                   ->where('v.name LIKE :name')
                   ->setParameter(':name', '%' . $name . '%');

        return $qb;
    }
}
