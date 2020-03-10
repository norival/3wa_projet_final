<?php

namespace App\Repository;

use App\Entity\Content;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @method Content|null find($id, $lockMode = null, $lockVersion = null)
 * @method Content|null findOneBy(array $criteria, array $orderBy = null)
 * @method Content[]    findAll()
 * @method Content[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Content::class);
    }

    /**
     * Return the query to get a list of available content
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
     * Search a content by its name and return content's id and name 
     *
     * @param  string $value
     *
     * @return array
     */
    public function searchByName(string $value)
    {
        $em = $this->getEntityManager();

        $query = $em
            ->createQuery(
                'SELECT c.id, c.name
                FROM App\Entity\Content c
                WHERE c.name LIKE :value'
            )
            ->setParameters([
                'value' => '%' . $value . '%',
            ]);

        return $query->getResult();
    }
}
