<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Dependence;
use Gedeon\Audi_Dependence;
use Gedeon\Http\Requests\CreateRolForm;

class dependenceController extends Controller
{
    public function viewDependences(){
        $dependences = Dependence::all();
        return $dependences;
    }

    public function viewDependence(Request $request){
        if(Auth::check()){
            $dependence = Dependence::find($request->id);
            return $dependence;
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }
    
    public function createDependence(CreateRolForm $request){
        if(Auth::check()){
            $dependence = new Dependence;
            $dependence->name = $request->name;
            $dependence->save();
            $audi_dependence = new Audi_Dependence;
            $audi_dependence->name = $request->name;
            $audi_dependence->id_user = Auth::user()->id;
            $audi_dependence->tipo_audi = 1;
            $audi_dependence->save();
           return ['success'=> $dependence];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }
    public function editDependence(CreateRolForm $request){
        if(Auth::check()){
            $dependence = Dependence::find($request->id);
            $dependence->name = $request->name;
            $dependence->save();
            $audi_dependence = new Audi_Dependence;
            $audi_dependence->name = $request->name;
            $audi_dependence->id_user = Auth::user()->id;
            $audi_dependence->tipo_audi = 2;
            $audi_dependence->save();
           return ['success'=>'ok'];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }
    public function deleteDependence(Request $request){
        if(Auth::check()){
        	$sessionUser = Auth::user()->name;
            $password = $request->deletePassword;
            if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
            	$dependence = Dependence::find($request->id);
	            /*$audi_dependence = new Audi_Dependence;
	            $audi_dependence->name = $dependence->name;
	            $audi_dependence->id_user = Auth::user()->id;
	            $audi_dependence->tipo_audi = 4;
	            $audi_dependence->save();
	            $dependence->delete();*/
	          	return ['success'=>$dependence->name];
            }
            else{
                return ['error'=> 'La contraseña es erronea'];
            }
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }
}
