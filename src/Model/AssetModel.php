<?php

namespace App\Model;

class AssetModel
{
    private $assets;

    public function __construct(array $assets)
    {
        $this->assets = $assets;
    }

    public function __get(string $name)
    {
        $result = array_filter($this->assets, function($value) use($name) {
            return $value['type'] === $name;
        });

        return $result;
    }

    public function __isset(string $name)
    {
        $set = array_reduce($this->assets, function ($carry, $item, $initial = false) use($name) {
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
