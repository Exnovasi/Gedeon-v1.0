<?php

namespace Gedeon;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Gedeon\Dependence;

class User extends Authenticatable
{
     public function dependence()
    {
        return $this->belongsTo('Gedeon\Dependence');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','avatar','dependence','role'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
