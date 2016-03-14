<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Result_Indicator;
use Gedeon\Audi_Result_Indicator;
use Gedeon\Program;
use Gedeon\Audi_Program;
use Gedeon\Http\Requests\indicatorResultForm;
use Gedeon\Http\Requests\indicatorResultEditForm;
use Auth;
use DB;

class resultIndicatorController extends Controller
{
    public function viewResultIndicator(Request $request){
        $data = Result_Indicator::select('*')->where('area',$request->area)->get();
        return $data;
    }
    public function viewIndicatorForName(Request $request){
        if ($request->name) {
            $data = Result_Indicator::select('*')->where('name', 'like' , '%'.$request->name.'%')->get();

            if(count($data) > 0){
                return $data;
            }
            else{
                return [['name'=>'No se encontraron coincidencias']];
            };
        }
    }
    public function createIndicator(indicatorResultForm $request){ 
    	$sessionUser = Auth::user()->name;        
        $data = new Result_Indicator;
        $data->name = $request->name;
        $data->goal = $request->goal;
        $data->unit = '%';
        $data->weight = $request->weight;
        $data->area = $request->area;
        $data->save();
        $data_audi = new Audi_Result_Indicator;
        $data_audi->name = $request->name;
        $data_audi->goal = $request->goal;
        $data_audi->unit = '%';
        $data_audi->weight = $request->weight;
        $data_audi->area = $request->area;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 1;
        $data_audi->save();
        return ['success'=>$data];
    }
    public function editIndicator(indicatorResultEditForm $request){
        $valid = Result_Indicator::select('id')
                ->where('name', $request->name)
                ->where('id', '<>', $request->id)
                ->get();
        if(count($valid) == 0){
            $data = Result_Indicator::find($request->id);
            $data->name = $request->name;
	        $data->goal = $request->goal;
	        $data->unit = '%';
	        $data->weight = $request->weight;
	        $data->area = $request->area;
	        $data->save();
            $data_audi = new Audi_Result_Indicator;
            $data_audi->name = $request->name;
	        $data_audi->goal = $request->goal;
	        $data_audi->unit = '%';
	        $data_audi->weight = $request->weight;
	        $data_audi->area = $request->area;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 2;
            $data_audi->save();
            return ['success'=>'ok'];
        }
        else{
            return ['error'=>'Este nombre ya ha sido asignado a otro indicador'];
        }
    }
    public function deleteIndicator(Request $request){
        $sessionUser = Auth::user()->name;
        $password = $request->deletePassword;
        if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
            $programs = Result_Indicator::select('*')
                        ->where('id', $request->id)
                        ->where('program',0)
                        ->get();
            if (count($programs) != 0) {
                $data = Result_Indicator::find($request->id);
                $data_audi = new Audi_Result_Indicator;
                $data_audi->name = $data->name;
                $data_audi->goal = $data->goal;
                $data_audi->goal = $data->unit;
                $data_audi->goal = $data->area;
                $data_audi->goal = $data->program;
                $data_audi->weight = $data->weight;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 4;
                $data_audi->save();
                $data->delete();
                return ['success'=>'ok'];
            }
            else{
                if ($request->reassignIndicatorId) {
                    if($request->reassignIndicatorId != $request->id){
                        $data = Result_Indicator::find($request->reassignIndicatorId);
                        if(count($data) > 0){
                            $reassignSearch = Result_Indicator::select('*')
                                            ->where('id', $request->reassignIndicatorId)
                                            ->where('program',0)
                                            ->get();
                            if(count($reassignSearch) > 0){
                                DB::beginTransaction();
                                $count = 0;
                                $valid = 0;
                                $indicator = Result_Indicator::find($request->id);
                                $indicator2 = Result_Indicator::find($request->reassignIndicatorId);
                                $indicator2->program = $indicator->program;
                                $data_audi = new Audi_Result_Indicator;
                                $data_audi->name = $indicator2->name;
                                $data_audi->goal = $indicator2->goal;
                                $data_audi->unit = $indicator2->unit;
                                $data_audi->weight = $indicator2->weight;
                                $data_audi->area = $indicator2->area;
                                $data_audi->program = $indicator->program;
                                $data_audi->id_user = Auth::user()->id;
                                $data_audi->tipo_audi = 2;
                                $valid += $indicator2->save();
                                $count ++;
                                if(($valid) != $count){
                                    DB::rollBack();
                                }
                                else{
                                    DB::commit();
                                }
                                $data = Result_Indicator::find($request->id);
                                $data_audi = new Audi_Result_Indicator;
                                $data_audi->name = $data->name;
    					        $data_audi->goal = $data->goal;
    					        $data_audi->unit = '%';
    					        $data_audi->weight = $data->weight;
    					        $data_audi->area = $data->area;
                                $data_audi->program = $data->program;
                                $data_audi->id_user = Auth::user()->id;
                                $data_audi->tipo_audi = 4;
                                $data_audi->save();
                                $data->delete();
                                return ['success'=>'ok'];
                            }
                            else{
                                return ['reassign'=>'Este indicador ya tiene programa(s) asociados para eliminar debe reasignarlas a otro indicador'];
                            }
                        }
                        else{
                            return ['error'=> 'El area a reasignar no existe'];  
                        }

                    }
                    else{
                        return ['error'=> 'No puedes reasignar en el area a borrar'];
                    }
                }
                else{
                    return ['reassign'=>'Este indicador tiene programa(s) asociados para eliminar debe reasignarlas a otro indicador'];
                }
            }
        }
        else{
            return ['error'=>'La contraseña es erronea'];
        }
    }
}
