<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Line;
use Gedeon\Area;
use Gedeon\Audi_Line;
use Gedeon\Audi_Area;
use Gedeon\Http\Requests\lineForm;
use Gedeon\Http\Requests\editLineForm;
use Auth;
use DB;

class LineController extends Controller
{
    public function viewLines(){
        $data = Line::all();
        return $data;
    }
    public function viewLine(Request $request){
        $data = Line::find($request->id);
        return $data;
    }
    public function createLine(lineForm $request){
    	$sessionUser = Auth::user()->name;        
        $data = new Line;
        $data->name = $request->name;
        $data->objective = $request->objective;
        $data->weight = $request->weight;
        $data->save();
        $data_audi = new Audi_Line;
        $data_audi->name = $request->name;
        $data_audi->objective = $request->objective;
        $data_audi->weight = $request->weight;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 1;
        $data_audi->save();
        return ['success'=>$data];
    }

    public function editLine(editLineForm $request){
        $data = Line::find($request->id);
        $data->name = $request->name;
        $data->objective = $request->objective;
        $data->weight = $request->weight;
        $data->save();
        $data_audi = new Audi_Line;
        $data_audi->name = $request->name;
        $data_audi->objective = $request->objective;
        $data_audi->weight = $request->weight;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 2;
        $data_audi->save();
        return ['success'=>'ok'];
    }

    public function deleteLine(Request $request){
        if(Auth::check()){
            $sessionUser = Auth::user()->name;
            $password =  $request->deletePassword;
            if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
                $areas = Area::select('*')->where('line', $request->id)->get();
                if (count( $areas ) == 0 ) {
                    
                    $data = Line::find($request->id);
                    $data_audi = new Audi_Line;
                    $data_audi->name = $data->name;
                    $data_audi->objective = $data->objective;
                    $data_audi->weight = $data->weight;
                    $data_audi->id_user = Auth::user()->id;
                    $data_audi->tipo_audi = 4;
                    $data_audi->save();
                    $data->delete();
                    return ['success'=>'Se elimino correctamente la linea'];
                }
                else{                    
                    if ($request->reassignLineId) {
                        if($request->reassignLineId != $request->id){
                            $data = Line::find($request->id);
                            if(count($data) > 0){
                                DB::beginTransaction();
                                $count = 0;
                                $valid = 0;
                                foreach ($areas as $update) {
                                    $area = Area::find($update->id);
                                    $area->line = $request->reassignLineId;
                                    $area->weight = 0;
                                    $data_audi = new Audi_Area;
                                    $data_audi->name = $area->name;
                                    $data_audi->objective = $area->objective;
                                    $data_audi->weight = $area->weight;
                                    $data_audi->line = $area->line;
                                    $data_audi->id_user = Auth::user()->id;
                                    $data_audi->tipo_audi = 2;
                                    $valid += $data_audi->save();
                                    $valid += $area->save();
                                    $count ++;
                                }
                                if(($valid/2) != $count){
                                    DB::rollBack();
                                }
                                else{
                                    DB::commit();
                                }
                                $data = Line::find($request->id);
                                $data_audi = new Audi_Line;
                                $data_audi->name = $data->name;
                                $data_audi->objective = $data->objective;
                                $data_audi->weight = $data->weight;
                                $data_audi->id_user = Auth::user()->id;
                                $data_audi->tipo_audi = 4;
                                $data_audi->save();
                                $data->delete();
                                return ['success'=>'se elimino correctamente la linea, recuerde que las áreas reasignadas toman un peso de 0%, por favor configurar estos valores nuevamente'];
                            }
                            else{
                                return ['error'=> 'La linea a reasignar no existe'];  
                            }
                        }
                        else{
                            return ['error'=> 'No puedes reasignar en la linea a borrar'];
                        }
                    }
                    else{
                        return ['reassign'=>'Esta línea tiene areas asociadas para eliminar debe reasignarlas a otra linea'];
                    }
                }
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
