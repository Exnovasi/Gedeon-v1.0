<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Program;
use Gedeon\Result_Indicator;
use Gedeon\Audi_Result_Indicator;
use Gedeon\Area;
use Gedeon\Project;
use Gedeon\Audi_Program;
use Gedeon\Audi_Project;
use Gedeon\Http\Requests\ProgramForm;
use Gedeon\Http\Requests\ProgramEditForm;
use Auth;
use DB;

class ProgramController extends Controller
{
    public function viewPrograms(){
        $data = Program::all();
        return $data;
    }
    public function viewProgram(Request $request){
        $data['programs'] = Program::select('programs.id as id', 'programs.name as name', 'programs.weight as weight', 'programs.objective as objective', 'programs.weight as weight')
                ->join('results_indicators as ri', 'programs.id', '=', 'ri.program')
                ->where('ri.area', $request->area)
                ->distinct()
                ->get();
        foreach ($data['programs'] as $program) {
            $data['ir'][] = Result_Indicator::select('id','name')
                            ->where('program', $program->id)
                            ->get();
        }
        return $data;
    }

    public function viewProgramForName(Request $request){
        if ($request->name) {
            $data = Program::select('*')->where('name', 'like' , '%'.$request->name.'%')->get();

            if(count($data) > 0){
                return $data;
            }
            else{
                return [['name'=>'No se encontraron coincidencias']];
            };
        }
    }
    
    public function viewIndicatorForArea(Request $request){
        if ($request->area && $request->indicator) {
            $data = Result_Indicator::select('name')
                    ->where('name', 'like' , '%'.$request->indicator.'%')
                    ->where('area', $request->area)
                    ->where('program', 0)
                    ->get();

            if(count($data) > 0){
                foreach ($data as $name) {
                    $res[] = $name['name'];
                }
                return $res;
            }
            else{
                return [['name'=>'No se encontraron coincidencias']];
            };

        }
        else{
            return [['name'=>$request]];    
        }
    }

    public function viewProgramForNameInArea(Request $request){
        if ($request->area && $request->search) {
            $data = Program::select('*')
                    ->where('name', 'like' , '%'.$request->search.'%')
                    ->where('area', $request->area)
                    ->get();

            if(count($data) > 0){
                return $data;
            }
            else{
                return [['name'=>'No se encontraron coincidencias']];
            };

        }
        else{
            return [['name'=>$request]];    
        }
    }



    public function createProgram(ProgramForm $request){ 
    	$sessionUser = Auth::user()->name;        
        $data = new Program;
        $data->name = $request->name;
        $data->objective = $request->objective;
        $data->weight = 100;
        $data->save();
        $data_audi = new Audi_Program;
        $data_audi->name = $request->name;
        $data_audi->objective = $request->objective;
        $data_audi->weight = 100;
        $data_audi->id_user = Auth::user()->id;
        $data_audi->tipo_audi = 1;
        $data_audi->save();
        foreach ($request->tags as $ir) {
            $ir['text'] = str_replace('-', ' ', $ir['text']);
            DB::table('results_indicators')
                ->where('name', $ir['text'])
                ->update(['program' => $data->id]);
            $data_audi = new Audi_Result_Indicator;
            $data_audi->name = $ir['text'];
            $data_audi->program = $data->id;
            $data_audi->area = $request->area;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 2;
            $data_audi->save();
        }
        return ['success'=>$data];
    }
    public function editProgram(ProgramEditForm $request){
        $valid = Program::select('id')
                ->where('name', $request->name)
                ->where('id', '<>', $request->id)
                ->get();
        if(count($valid) == 0){
            $data = Program::find($request->id);
            $data->name = $request->name;
            $data->objective = $request->objective;
            $data->weight = 100;
            $data->save();
            $data_audi = new Audi_Program;
            $data_audi->name = $request->name;
            $data_audi->objective = $request->objective;
            $data_audi->weight = 100;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 2;
            $data_audi->save();
            DB::table('results_indicators')
                    ->where('program', $request->id)
                    ->update(['program' => 0]);
            foreach ($request->tags as $ir) {
                $ir['text'] = str_replace('-', ' ', $ir['text']);
                DB::table('results_indicators')
                    ->where('name', $ir['text'])
                    ->update(['program' => $data->id]);
                $data_audi = new Audi_Result_Indicator;
                $data_audi->name = $ir['text'];
                $data_audi->program = $data->id;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 2;
                $data_audi->save();
            }
            return ['success'=>'ok'];
        }
        else{
            return ['error'=>'Este nombre ya ha sido asignado a otra área'];
        }
    }
    public function deleteProgram(Request $request){
        $sessionUser = Auth::user()->name;
        $password = $request->deletePassword;
        if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
            $project = Project::select('*')->where('program', $request->id)->get();
            if(count($project) == 0){
                $data = Program::find($request->id);
                $data_audi = new Audi_Program;
                $data_audi->name = $data->name;
                $data_audi->objective = $data->objective;
                $data_audi->weight = $data->weight;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 4;
                $data_audi->save();
                $data->delete();
                return ['success'=>'ok'];
            }
            else{
                if ($request->reassignProgramId) {
                    if($request->reassignProgramId != $request->id){
                        $data = Program::find($request->reassignProgramId);
                        if(count($data) > 0){
                            DB::beginTransaction();
                            $count = 0;
                            $valid = 0;
                            foreach ($project as $update) {
                                $program = Project::find($update->id);
                                $program->program = $request->reassignProgramId;
                                $data_audi = new Audi_Project;
                                $data_audi->name = $program->name;
                                $data_audi->objective = $program->objective;
                                $data_audi->weight = $program->weight;
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
                            DB::table('results_indicators')
                                ->where('program', $request->id)
                                ->update(['program' => 0]);
                            $data = Program::find($request->id);
                            $data_audi = new Audi_Program;
                            $data_audi->name = $data->name;
                            $data_audi->objective = $data->objective;
                            $data_audi->weight = $data->weight;
                            $data_audi->id_user = Auth::user()->id;
                            $data_audi->tipo_audi = 4;
                            $data_audi->save();
                            $data->delete();
                            return ['success'=>'ok'];
                    }
                        else{
                            return ['error'=> 'El programa a reasignar no existe'];  
                        }

                    }
                    else{
                        return ['error'=> 'No puedes reasignar en el programa a borrar'];
                    }
                }
                else{
                    return ['reassign'=>'Este programa tiene proyecto(s) asociados para eliminar debe reasignarlas a otro programa'];
                }
            }
        }
        else{
            return ['error'=>'La contraseña es erronea'];
        }
    }
}
