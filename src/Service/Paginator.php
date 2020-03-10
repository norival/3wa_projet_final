<?php

namespace App\Service;

use Countable;
use Doctrine\ORM\QueryBuilder;

/**
 * Service that provides simple pagination
 *
 * @author Xavier Laviron <xavier@norival.dev>
 */
class Paginator implements Countable
{
    /** @var array $results */
    private $results;

    /** @var array $state */
    private $state;

    public function __construct()
    {
        $this->results = [];
        $this->state   = [];
    }

    /**
     * Run the paginator: count the total number of elements and fetch the
     * requested number from the database
     *
     * @param  QueryBuilder $query The query
     * @param  int $page The current page
     * @param  int $itemsPerPage The number of items per page
     * @return self
     */
    public function paginate(QueryBuilder $query, int $page, int $itemsPerPage): self
    {
        $rootAlias = $query->getRootAlias();

        $this->state['page']         = $page;
        $this->state['itemsPerPage'] = $itemsPerPage;
        $this->state['total']        = (int)$query->select("COUNT($rootAlias)")
                                                  ->getQuery()
                                                  ->getSingleScalarResult();
        $this->state['numberOfPages'] = \ceil($this->state['total'] / $itemsPerPage);

        // fetch results from database
        $this->results = $query->select($rootAlias)
                               ->setMaxResults($itemsPerPage)
                               ->setFirstResult(($page - 1) * $itemsPerPage)
                               ->getQuery()
                               ->getResult();

        return $this;
    }

    /**
     * @inheritdoc
     */
    public function count(): int
    {
        return count($this->getResults());
    }

    /**
     * Get the results
     *
     * @return array
     */
    public function getResults(): array
    {
        return $this->results;
    }

    /**
     * Get the state of the paginator
     *
     * @return array
     */
    public function getState(): array
    {
        return $this->state;
    }
}
