<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Area;
use DB;
use Gedeon\Audi_Area;
use Gedeon\Line;
use Gedeon\Program;
use Gedeon\Result_Indicator;
use Gedeon\Audi_Result_Indicator;
use Gedeon\Http\Requests\AreaForm;
use Gedeon\Http\Requests\AreaEditForm;
use Auth;

class AreaController extends Controller
{
    
    public function viewAreas(Request $request){
        $data = Area::select('*')->where('line', $request->line)->get();
        return $data;
    }
    public function viewArea(Request $request){
        $data = Area::find($request->id);
        return $data;
    }
    public function createArea(AreaForm $request){
        $sessionUser = Auth::user()->name;        
        $data = new Area;
        $data->name = $request->name;
        $data->objective = $request->objective;
        $data->weight = $request->weight;
        $data->line = $request->line;
        $data->save();
        $data_audi = new Audi_Area;
        $data_audi->name = $request->name;
        $data_audi->objective = $request->objective;
        $data_audi->weight = $request->weight;
        $data_audi->line = $request->line;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 1;
        $data_audi->save();
        return ['success'=>$data];
    }
    public function editArea(AreaEditForm $request){
        $valid = Area::select('id')
                ->where('name', $request->name)
                ->where('id', '<>', $request->id)
                ->get();
        if(count($valid) == 0){
            $data = Area::find($request->id);
            $data_audi = new Audi_Area;
            //si el área se cambio de línea se reasigna a la nueva línea con peso 0
            if ( $data->line != $request->line) {
                if(Line::find($request->line)){ 
                   
                    $data->weight = 0;
                    $data_audi->weight = 0;
                    
                }
                else{
                    return ['error'=> 'La línea seleccionada no existe'];
                }
            }
            else{
                //si no se le asigna el peso que envian en la peticion.
                $data->weight = $request->weight;
                $data_audi->weight = $request->weight;
            }
            
            $data->name = $request->name;
            $data->objective = $request->objective;
            $data->line = $request->line;
            $data->save();
            $data_audi->name = $request->name;
            $data_audi->objective = $request->objective;
            $data_audi->line = $request->line;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 2;
            $data_audi->save();
            return ['success'=>'ok'];
        }
        else{
            return ['error'=>'Este nombre ya ha sido asignado a otra linea'];
        }
    }
    public function deleteArea(Request $request){
        $sessionUser = Auth::user()->name;
        $password = $request->deletePassword;
        if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
            $result_indicators = Result_Indicator::select('*')->where('area', $request->id)->get();
            if (count($result_indicators) == 0) {
                $data = Area::find($request->id);
                $data_audi = new Audi_Area;
                $data_audi->name = $data->name;
                $data_audi->objective = $data->objective;
                $data_audi->indicator = $data->indicator;
                $data_audi->weight = $data->weight;
                $data_audi->line = $data->line;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 4;
                $data_audi->save();
                $data->delete();
                return ['success'=>'ok'];
            }
            else{
                if ($request->reassignAreaId) {
                    if($request->reassignAreaId != $request->id){
                        $data = Area::find($request->id);
                        if(count($data) > 0){
                            DB::beginTransaction();
                            $count = 0;
                            $valid = 0;
                            foreach ($result_indicators as $update) {
                                $program = Result_Indicator::find($update->id);
                                $program->area = $request->reassignAreaId;
                                $program->weight = 0;
                                $data_audi = new Audi_Result_Indicator;
                                $data_audi->name = $program->name;
                                $data_audi->goal = $program->goal;
                                $data_audi->unit = $program->unit;
                                $data_audi->weight = 0;
                                $data_audi->area = $request->reassignAreaId;
                                $data_audi->id_user = Auth::user()->id;
                                $data_audi->tipo_audi = 2;
                                $valid += $data_audi->save();
                                $valid += $program->save();
                                $count ++;
                            }
                            if(($valid/2) != $count){
                                DB::rollBack();
                            }
                            else{
                                DB::commit();
                            }
                            $data = Area::find($request->id);
                            $data_audi = new Audi_Area;
                            $data_audi->name = $data->name;
                            $data_audi->objective = $data->objective;
                            $data_audi->indicator = $data->indicator;
                            $data_audi->weight = $data->weight;
                            $data_audi->line = $data->line;
                            $data_audi->id_user = Auth::user()->id;
                            $data_audi->tipo_audi = 4;
                            $data_audi->save();
                            $data->delete();
                            return ['success'=>'ok'];
                        }
                        else{
                            return ['error'=> 'El area a reasignar no existe'];  
                        }

                    }
                    else{
                        return ['error'=> 'No puedes reasignar en el área a borrar'];
                    }
                }
                else{
                    return ['reassign'=>'Esta área tiene indicador(es) asociados, para eliminar debe reasignarlas a otra área'];
                }
            }
        }
        else{
            return ['error'=>'La contraseña es erronea'];
        }
    }
}
