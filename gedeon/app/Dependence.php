<?php

namespace Gedeon;

use Illuminate\Database\Eloquent\Model;
use Gedeon\User;

class Dependence extends Model
{

    public function users()
    {
        return $this->hasMany('Gedeon\User');
    }

    protected $fillable = [
        'name'
    ];

    protected $table = 'dependences';
}
