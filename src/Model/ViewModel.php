<?php

namespace App\Model;

class ViewModel
{
    private $content = null;

    public function __construct()
    {
        $content = [];
    }

    public function bindContent(array $content)
    {
        $this->content = $content;

        return $this;
    }

    public function __get(string $name)
    {
        $result = array_filter($this->content, function($value) use($name) {
            return $value->getType() === $name;
        });

        return $result;
    }

    public function __isset(string $name)
    {
        $set = array_reduce($this->content, function ($carry, $item, $initial = false) use($name) {
            if ($carry) {
                return true;
            }

            if ($item->getType() === $name) {
                return true;
            }

            return false;
        });

        return $set;
    }
}
