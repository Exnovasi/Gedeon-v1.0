<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Product_Indicator;
use Gedeon\Audi_Product_Indicator;
use Gedeon\Http\Requests\indicatorProductForm;
use Gedeon\Http\Requests\indicatorProductEditForm;

use DB;
use Auth;

class productIndicatorController extends Controller
{
    public function viewProductIndicador(Request $request){
        $data = Product_Indicator::select('*')->where('project', $request->project)->get();
        return $data;
    }
    public function createIndicatorProduct(indicatorProductForm $request){ 
    	$sessionUser = Auth::user()->name;        
        $data = new Product_Indicator;
        $data->name = $request->name;
        $data->goal = $request->goal;
        $data->unit = '%';
        $data->weight = $request->weight;
        $data->project = $request->project;
        $data->save();
        $data_audi = new Audi_Product_Indicator;
        $data_audi->name = $request->name;
        $data_audi->goal = $request->goal;
        $data_audi->unit = '%';
        $data_audi->weight = $request->weight;
        $data_audi->project = $request->project;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 1;
        $data_audi->save();
        return ['success'=>$data];
    }
    public function editIndicatorProduct(indicatorProductEditForm $request){
        $valid = Product_Indicator::select('id')
                ->where('name', $request->name)
                ->where('id', '<>', $request->id)
                ->get();
        if(count($valid) == 0){
            $data = Product_Indicator::find($request->id);
            $data->name = $request->name;
	        $data->goal = $request->goal;
	        $data->unit = '%';
	        $data->weight = $request->weight;
	        $data->project = $request->project;
	        $data->save();
            $data_audi = new Audi_Product_Indicator;
            $data_audi->name = $request->name;
	        $data_audi->goal = $request->goal;
	        $data_audi->unit = '%';
	        $data_audi->weight = $request->weight;
	        $data_audi->project = $request->project;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 2;
            $data_audi->save();
            return ['success'=>'ok'];
        }
        else{
            return ['error'=>'Este nombre ya ha sido asignado a otro indicador'];
        }
    }
    public function deleteIndicatorProduct(Request $request){
    	$sessionUser = Auth::user()->name;
        $password = $request->deletePassword;
        if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
	        $data = Product_Indicator::find($request->id);
            $data_audi = new Audi_Product_Indicator;
            $data_audi->name = $data->name;
            $data_audi->goal = $data->goal;
            $data_audi->unit = $data->unit;
            $data_audi->project = $data->project;
            $data_audi->weight = $data->weight;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 4;
            $data_audi->save();
            $data->delete();
            return ['success'=>'ok'];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }
}
