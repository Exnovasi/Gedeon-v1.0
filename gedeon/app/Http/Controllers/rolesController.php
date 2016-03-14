<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Http\Requests\CreateRolForm;
use Auth;
use Gedeon\Roles;
use Gedeon\Audi_Roles;

class rolesController extends Controller
{
    public function viewRoles(){
        $roles = Roles::all();
        return $roles;
    }

    public function viewRol(Request $request){
        if(Auth::check()){
            $rol = Roles::find($request->id);
            return $rol;
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }

    public function createRol(CreateRolForm $request){
        if(Auth::check()){
            $rol = new Roles;
            $rol->nombre = $request->nombre;
            $rol->descripcion = $request->descripcion;
            $rol->save();
            $audi_rol = new Audi_Roles;
            $audi_rol->nombre = $request->nombre;
            $audi_rol->descripcion = $request->descripcion;
            $audi_rol->id_user = Auth::user()->id;
            $audi_rol->tipo_audi = 1;
            $audi_rol->save();
           return ['success'=>'ok'];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }

    public function editRol(CreateRolForm $request){
        if(Auth::check()){
            $rol = Roles::find($request->id);
            $rol->nombre = $request->nombre;
            $rol->descripcion = $request->descripcion;
            $rol->save();
            $audi_rol = new Audi_Roles;
            $audi_rol->nombre = $request->nombre;
            $audi_rol->descripcion = $request->descripcion;
            $audi_rol->id_user = Auth::user()->id;
            $audi_rol->tipo_audi = 2;
            $audi_rol->save();
           return ['success'=>'ok'];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }

    public function deleteRol(Request $request){
        $rol = Roles::find($request->id);
        $audi_rol = new Audi_Roles;
        $audi_rol->nombre = $rol->nombre;
        $audi_rol->descripcion = $rol->descripcion;
        $audi_rol->id_user = Auth::user()->id;
        $audi_rol->tipo_audi = 4;
        $audi_rol->save();
        $rol->delete();
        return ['msg'=>'ok'];
    }
}
