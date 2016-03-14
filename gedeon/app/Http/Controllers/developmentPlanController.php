<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Development_Plan;
use Gedeon\Http\Requests\DevelopmentPlan;
use Gedeon\Audi_Development_Plan;

class developmentPlanController extends Controller
{
    public function viewDevelopmentPlan(){
        $count = Development_Plan::all();
        
        if(count($count) == 0){
            $data = ['image'=>'img/Gedeon-Logo.jpg','title'=>'Este es el titulo Plan de Desarrollo','description'=>'Ingrese aqui la descripcion '];
            return $data;
        }
        else{
            $data = Development_Plan::find(1);
            return $data;
        }

        
    }

    public function createDevelopmentPlan(DevelopmentPlan $request){

    	
        $count = Development_Plan::all();
    	$audi_data = new Audi_Development_Plan;
    	if(count($count) == 0){

            list(, $request->image) = explode(';', $request->image);
            list(, $request->image) = explode(',', $request->image);
            //Decodificamos $request->image codificada en base64.
            $image = base64_decode($request->image);
            $fileName = "img/development_plan/development_plan.jpg";
            //escribimos la información obtenida en un archivo llamado 
            //$idUnico = time().jpg para que se cree la imagen correctamente
            file_put_contents($fileName, $image); //se crea la imagen en la ruta
    		$data = new Development_Plan;
    		$audi_data->tipo_audi = 1;
            $data->image = $fileName;
            $audi_data->image = $request->image;
    	}
    	else{
    		$data = Development_Plan::find(1);
    		$audi_data->tipo_audi = 2;
    	    $audi_data->image = $request->image;
            $data->image = $request->image;
        }
        $data->title = $request->title;
        $audi_data->title = $request->title;
    	$data->description = $request->description;
    	$audi_data->description = $request->description;
    	$audi_data->id_user = Auth::user()->id;
    	$data->save();
    	$audi_data->save();
        return ['success'=>'ok'];
    }

    public function editImgDevPlan(Request $request){
        list(, $request->image) = explode(';', $request->image);
        list(, $request->image) = explode(',', $request->image);
        //Decodificamos $request->image codificada en base64.
        $image = base64_decode($request->image);
        $fileName = "img/development_plan/development_plan.jpg";
        //escribimos la información obtenida en un archivo llamado 
        //$idUnico = time().jpg para que se cree la imagen correctamente
        file_put_contents($fileName, $image); //se crea la imagen en la ruta
        $count = Development_Plan::all();
        $audi_data = new Audi_Development_Plan;
        if(count($count) == 0){
            $data = new Development_Plan;
            $audi_data->tipo_audi = 1;
        }
        else{
            $data = Development_Plan::find(1);
            $audi_data->tipo_audi = 2;
        }
        $data->description = $request->description;
        $data->image = $fileName;
        $audi_data->title = $request->title;
        $audi_data->image = $fileName;
        $audi_data->description = $request->description;
        $audi_data->id_user = Auth::user()->id;
        $data->save();
        $audi_data->save();
        return ['success'=>'ok'];
    }

   
}
