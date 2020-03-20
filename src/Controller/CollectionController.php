<?php

namespace App\Controller;

use App\Entity\Collection;
use App\Entity\CollectionAsset;
use App\Entity\CollectionContent;
use App\Entity\Content;
use App\Form\CollectionType;
use App\Model\AssetModel;
use App\Model\ContentModel;
use App\Repository\CollectionRepository;
use App\Service\Paginator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class CollectionController extends AbstractController
{
    private $em;
    private $serializer;
    private $collectionRepository;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        CollectionRepository $repo
    )
    {
        $this->em             = $em;
        $this->serializer     = $serializer;
        $this->collectionRepository = $repo;
    }

    /**
     * @Route("/{locale}/{name}", name="collection", requirements={"locale"="[a-z]{2}"})
     */
    public function index(string $locale, string $name)
    {
        /* TODO: the join returns an array with the content. It whould be better if it returned
         * an array of Content objects (for the templates). If it is not possible, try to implement
         * custom filter/function for twig
         */

        // get the collection from the db
        $collection = $this->em->getRepository(Collection::class)->findOneBy(['name' => $name]);

        // use models to simplify templating
        $contentModel = new ContentModel(
            $this->em->getRepository(CollectionContent::class)->findByCollectionIdJoined($collection->getId())
        );
        $assetModel = new AssetModel(
            $this->em->getRepository(CollectionAsset::class)->findByCollectionIdJoined($collection->getId())
        );

        return $this->render("collection/$name.html.twig", [
            'title'        => $collection->getTitle(),
            'contentModel' => $contentModel,
            'assetModel'   => $assetModel,
            'admin'        => false,
        ]);
    }

    /**
     * @Route("/admin/collection/visual/{id}", name="collection_admin_visual", requirements={"id"="\d+"})
     *
     * Renders a collection from a template to be used in admin UI
     *
     * @param int $id The id of the collection
     */
    public function renderVisualAdmin(int $id)
    {
        // get the collection from the db
        $collection = $this->em->getRepository(Collection::class)->findOneBy(['id' => $id]);
        $name = $collection->getName();

        // use models to simplify templating
        $contentModel = new ContentModel(
            $this->em->getRepository(CollectionContent::class)->findByCollectionIdJoined($collection->getId())
        );
        $assetModel = new AssetModel(
            $this->em->getRepository(CollectionAsset::class)->findByCollectionIdJoined($collection->getId())
        );

        return $this->render("collection/$name.html.twig", [
            'title'        => $collection->getTitle(),
            'contentModel' => $contentModel,
            'assetModel'   => $assetModel,
            'admin'        => true,
        ]);
    }



    /**
     * List all the available collections (with pagination) and return result as JSON data
     *
     * @Route("/collection/list", name="collection_list", methods={"GET"})
     *
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @param  Request $request
     * @return JsonResponse
     */
    public function list(Paginator $paginator, SerializerInterface $serializer, Request $request)
    {
        // get query from repository
        $listQuery = $this->collectionRepository->list(true);

        // paginate results
        $paginator->paginate(
            $listQuery,
            $request->query->getInt('page', 1),
            $request->query->getInt('itemsPerPage', 5)
        );

        // serialize results
        $json = $serializer->serialize(
            [
                'state'   => $paginator->getState(),
                'results' => $paginator->getResults(),
            ],
            'json',
            ['groups' => 'list']
        );

        return JsonResponse::fromJsonString($json, 200);
    }

    /**
     * Search available collections by name
     *
     * @Route("/collection/search", name="collection_search", methods="GET")
     *
     * @param  Request $request
     * @param  Paginator $paginator
     * @param  SerializerInterface $serializer
     * @return JsonResponse
     */
    public function searchByName(Request $request, Paginator $paginator, SerializerInterface $serializer): JsonResponse
    {
        $searchQuery = $this->collectionRepository->searchByName($request->query->get('name'));

        $paginator->paginate(
            $searchQuery,
            1,
            $request->query->getInt('itemsPerPage', 10)
        );

        $json = $serializer->serialize(
            [
                'state'   => $paginator->getState(),
                'results' => $paginator->getResults(),
            ],
            'json',
            ['groups' => 'list']
        );

        return JsonResponse::fromJsonString($json);
    }

    /**
     * getForm
     *
     * Get the collection information and send it to the admin as JSON data
     *
     * @Route("/admin/collection/form/{id}", name="collection_get_form", methods={"GET"})
     *
     * @param  string $name
     * @return Response
     */
    public function getForm(SerializerInterface $serializer, string $id)
    {
        // get the collection object
        $collection = $this->em->getRepository(Collection::class)->findOneBy(['id' => $id]);
        $json = $serializer->serialize($collection, 'json', ['groups' => 'form']);

        return new JsonResponse($json);
    }

    /**
     * Get a collection by its id
     *
     * @Route("/collection/{id}", name="collection_get", requirements={"id"="\d+"})
     *
     * @param  int $id
     * @return JsonResponse
     */
    public function get(string $id): JsonResponse
    {
        $collection = $this->collectionRepository->find($id);
        $json = $this->serializer->serialize(
            $collection,
            'json',
            ['groups' => 'default']
        );

        return JsonResponse::fromJsonString($json);
    }

    /**
     * Update collection
     *
     * Update a collection
     *
     * @Route("/admin/collection/{id}", name="collection_update", methods={"PUT", "PATCH"})
     *
     * @param  string $id
     * @return JsonResponse The response
     */
    public function update(Request $request, string $id)
    {
        $collection = $this->em->getRepository(Collection::class)->findOneBy(['id' => $id]);
        $form = $this->createForm(CollectionType::class, $collection);

        $data = json_decode($request->getContent(), true);
        $form->submit($data, false);

        if ($form->isValid()) {
            $collection->setUpdatedAt(date_create());

            $this->em->persist($collection);
            $this->em->flush();

            // TODO set location header to link the updated resource
            // send the id of the updated collection
            return new JsonResponse(\json_encode($collection->getId()), 200);
        }

        // TODO useful error message
        $errorMessage = 'The data is not valid';
        return new JsonResponse(\json_encode($errorMessage), 400);
    }

    /**
     * Delete a collection
     *
     * @Route("/admin/collection/{id}", name="collection_delete", requirements={"id"="\d+"}, methods="DELETE")
     *
     * @param  string $id
     * @return JsonResponse
     */
    public function delete(string $id): JsonResponse
    {
        $collection = $this->collectionRepository->find($id);

        if ($collection) {
            $this->em->remove($collection);
            $this->em->flush();
        }

        return new JsonResponse(null, 204);
    }

    /**
     * Delete content(s) from the collection
     *
     * @Route("/admin/collection/{id}/content", name="collection_remove_content", methods="DELETE")
     *
     * @param  string $id The collection id
     * @param  Request $request The request
     * @return JsonResponse The response
     */
    public function removeContent(Request $request, string $id)
    {
        // get content ids from the request body
        /** @var Int[] $contentIds */
        $contentIds = json_decode($request->getContent(), true);

        /** @var CollectionContent[] $collectionContents */
        $collectionContents = $this->em->getRepository(CollectionContent::class)->findBy([
            'collection' => $id,
            'content'    => $contentIds,
        ]);

        if (!empty($collectionContents)) {
            foreach ($collectionContents as $collectionContent) {
                // delete CollectionContent object
                $this->em->remove($collectionContent);
            }

            // flush the database
            $this->em->flush();
        }

        // return success status code and empty body, even if nothing has been deleted
        return new JsonResponse(null, 204);
    }

    /**
     * Delete content(s) from the collection
     *
     * @Route("/admin/collection/{id}/content", name="collection_add_content", methods="PATCH")
     *
     * @param  string $id The collection id
     * @param  Request $request The request
     * @return JsonResponse The response
     */
    public function addContent(Request $request, string $id)
    {
        /** @var Int[] $contentIds */
        $contentIds = \json_decode($request->getContent(), true);

        /** @var \App\Entity\Collection $collection */
        $collection = $this->collectionRepository->find($id);

        /** @var \App\Entity\Content[] $contents */
        $contents = $this->em->getRepository(Content::class)->findBy(['id' => $contentIds]);

        if (empty($contents)) {
            throw $this->createNotFoundException('No content correspond to the given id(s)');
        }

        foreach ($contents as $content) {
            // TODO check if already present
            // Create a new collectionContent object
            $collectionContent = new CollectionContent();

            $collectionContent->setContent($content);
            $collectionContent->setCollection($collection);

            $this->em->persist($collectionContent);
        }
        $this->em->flush();

        return new JsonResponse($collection->getId(), 201);
    }
}
