<?php

namespace App\Exceptions;

use Exception;

class NoPermissionException extends Exception
{
    public function __construct()
    {
        parent::__construct();
    }
}