<?php

namespace App\Repository;

use App\Entity\Collection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @method Collection|null find($id, $lockMode = null, $lockVersion = null)
 * @method Collection|null findOneBy(array $criteria, array $orderBy = null)
 * @method Collection[]    findAll()
 * @method Collection[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CollectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Collection::class);
    }

    /**
     * Return the query to get a list of available collections
     *
     * @param bool $joinUser Whether to join the users informations or not
     * @return QueryBuilder
     */
    public function list(bool $joinUser = true): QueryBuilder
    {
        $qb = $this->createQueryBuilder('c')
                   ->orderBy('c.created_at', 'DESC');

        if ($joinUser) {
            $qb->innerJoin('c.user', 'u');
        }

        return $qb;
    }

    /**
     * Search a collection by its name and return the QueryBuilder for use with the
     * pagination
     *
     * @param  string $name The name to look for in the database
     *
     * @return QueryBuilder
     */
    public function searchByName(string $name): QueryBuilder
    {
        $qb = $this->createQueryBuilder('c')
                   ->where('c.name LIKE :name')
                   ->setParameter(':name', '%' . $name . '%');

        return $qb;
    }
}
