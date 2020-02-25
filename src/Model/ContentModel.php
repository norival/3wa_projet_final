<?php

namespace App\Model;

class ContentModel
{
    private $contents;

    public function __construct(array $contents)
    {
        $this->contents = $contents;
    }

    public function __get(string $name)
    {
        $result = array_filter($this->contents, function($value) use($name) {
            return $value['type'] === $name;
        });

        return $result;
    }

    public function __isset(string $name)
    {
        $set = array_reduce($this->contents, function ($carry, $item, $initial = false) use($name) {
            if ($carry) {
                return true;
            }

            if ($item['type'] === $name) {
                return true;
            }

            return false;
        });

        return $set;
    }
}
