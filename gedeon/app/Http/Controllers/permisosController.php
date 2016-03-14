<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Roles;
use Gedeon\Audi_Permisos;
use Gedeon\Http\ImgRedimension;

class permisosController extends Controller
{
    public function viewPermisos (){
    	$rol_permisos = Roles::select('roles.id as id', 'roles.nombre as nombre', 'permisos.ver as ver', 'permisos.crear as crear', 'permisos.editar as editar', 'permisos.eliminar as eliminar')
            ->leftJoin('permisos', 'roles.id', '=', 'permisos.id_rol')
            ->get();
        return $rol_permisos;
    }
    public function lab(){
    	return ImgRedimension::newImg('hola');
    }
}
