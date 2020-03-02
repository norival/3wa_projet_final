<?php

namespace App\Form;

use App\Entity\View;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ViewType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('title', TextType::class)
            ->add('viewContents', CollectionType::class, [
                'entry_type'   => ViewContentType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'entry_options' => [
                    'label' => false,
                ],
            ])
            ->add('created_at')
            ->add('updated_at')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class'      => View::class,
            'csrf_protection' => false,
        ]);
    }
}
