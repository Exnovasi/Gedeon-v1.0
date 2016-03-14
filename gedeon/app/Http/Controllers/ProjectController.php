<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Project;
use Gedeon\Product_indicator;
use Gedeon\Audi_Product_indicator;
use Gedeon\Program;
use Gedeon\Audi_Project;
use Gedeon\Http\Requests\ProjectForm;
use Gedeon\Http\Requests\ProjectEditForm;
use Auth;

class ProjectController extends Controller
{
    public function viewProjects(){
        $data = Project::all();
        return $data;
    }

    public function viewProjectsDetails (Request $request){
        $data = Project::select('projects.id as id','projects.name as name','projects.description as description','projects.weight as weight','projects.budget as budget','projects.program as program','projects.dependence as dependence', 'projects.operative as operative','projects.year1 as year1','projects.year2 as year2','projects.year3 as year3','projects.year4 as year4','users.name as operativename','dependences.name as dependencename','programs.name as programname')
            ->leftJoin('users', 'projects.operative', '=', 'users.id')
            ->join('dependences', 'projects.dependence', '=', 'dependences.id')
            ->join('programs', 'projects.program', '=', 'programs.id')
            ->get();
        return $data;
    }

    public function viewProject(Request $request){
        $data = Project::select('projects.id as id','projects.name as name','projects.description as description','projects.weight as weight','projects.budget as budget','projects.program as program','projects.dependence as dependence', 'projects.operative as operative','projects.year1 as year1','projects.year2 as year2','projects.year3 as year3','projects.year4 as year4','users.name as operativename','dependences.name as dependencename','programs.name as programname')
            ->leftJoin('users', 'projects.operative', '=', 'users.id')
            ->join('dependences', 'projects.dependence', '=', 'dependences.id')
            ->join('programs', 'projects.program', '=', 'programs.id')
            ->where('projects.program', $request->program)
            ->get();
        return $data;
    }
    public function viewProjectForDependence(Request $request){
        if ($request->dependence && $request->project) {
            $data = Project::select('name')
                    ->where('name', 'like' , '%'.$request->project.'%')
                    ->where('dependence', $request->dependence)
                    ->where('operative', 0)
                    ->get();

            if(count($data) > 0){
                foreach ($data as $name) {
                    $res[] = $name['name'];
                }
                return $res;
            }
            else{
                return [''];
            };

        }
    }
    //carga los poryectos asignados a un usuario operativo o encargado de área
    public function loadProjectsUser(){
        $sessionUser = Auth::user();
        if ($sessionUser->role == 1) {

            $data = Project::select('projects.id as id','projects.name as name','projects.description as description','projects.weight as weight','projects.budget as budget','projects.program as program','projects.dependence as dependence', 'projects.operative as operative','projects.year1 as year1','projects.year2 as year2','projects.year3 as year3','projects.year4 as year4','users.name as operativename','dependences.name as dependencename','programs.name as programname')
                ->leftJoin('users', 'projects.operative', '=', 'users.id')
                ->join('dependences', 'projects.dependence', '=', 'dependences.id')
                ->join('programs', 'projects.program', '=', 'programs.id')
                ->where('projects.dependence', $sessionUser->dependence)
                ->get();
        }
        else{

            $data = Project::select('projects.id as id','projects.name as name','projects.description as description','projects.weight as weight','projects.budget as budget','projects.program as program','projects.dependence as dependence', 'projects.operative as operative','projects.year1 as year1','projects.year2 as year2','projects.year3 as year3','projects.year4 as year4','users.name as operativename','dependences.name as dependencename','programs.name as programname')
                ->leftJoin('users', 'projects.operative', '=', 'users.id')
                ->join('dependences', 'projects.dependence', '=', 'dependences.id')
                ->join('programs', 'projects.program', '=', 'programs.id')
                ->where('projects.operative', $sessionUser->id)
                ->get();
        }
        return $data;
    }
    public function createProject(ProjectForm $request){ 
        if ($request->year1 + $request->year2 + $request->year3 + $request->year4 <= 100) {
        	$sessionUser = Auth::user()->name;        
            $data = new Project;
            $data->name = $request->name;
            $data->description = $request->description;
            $data->weight = $request->weight;
            $data->program = $request->program;
            $data->budget = $request->budget;
            $data->dependence = $request->dependence;
            $data->year1 = $request->year1;
            $data->year2 = $request->year2;
            $data->year3 = $request->year3;
            $data->year4 = $request->year4;
            $data->save();
            $data_audi = new Audi_Project;
            $data_audi->name = $request->name;
            $data_audi->description = $request->description;
            $data_audi->weight = $request->weight;
            $data_audi->program = $request->program;
            $data_audi->budget = $request->budget;
            $data_audi->dependence = $request->dependence;
            $data_audi->year1 = $request->year1;
            $data_audi->year2 = $request->year2;
            $data_audi->year3 = $request->year3;
            $data_audi->year4 = $request->year4;
            $data_audi->id_user = Auth::user()->id;
            $data_audi->tipo_audi = 1;
            $data_audi->save();
            return ['success'=>$data];
        }
        else{
            return ['error'=>'La suma de los 4 años de ejecución no debe superar 100'];
        }

    }

    public function editProject(ProjectEditForm $request){
        $valid = Project::select('id')
                ->where('name', $request->name)
                ->where('id', '<>', $request->id)
                ->get();
        if(count($valid) == 0){
            if ($request->year1 + $request->year2 + $request->year3 + $request->year4 <= 100) {
                $data = Project::find($request->id);
                $data_audi = new Audi_Project;
                //si el proyecto se cambio de programa se reasigna al nuevo programa con peso 0
                if ( $data->program != $request->program) {
                    if(Program::find($request->program)){                       

                            $data->weight = 0;
                            $data_audi->weight = 0;
                           
                    }
                    else{
                        return ['error'=> 'El programa seleccionado no existe'];
                    }
                }
                else{
                    //si no se le asigna el peso que envian en la peticion.
                    $data->weight = $request->weight;
                    $data_audi->weight = $request->weight;
                }

                $data->name = $request->name;
                $data->description = $request->description;
                $data->program = $request->program;
                $data->budget = $request->budget;
                $data->dependence = $request->dependence;
                $data->year1 = $request->year1;
                $data->year2 = $request->year2;
                $data->year3 = $request->year3;
                $data->year4 = $request->year4;
                $data->save();    
                $data_audi->program = $request->program;
                $data_audi->budget = $request->budget;
                $data_audi->dependence = $request->dependence;
                $data_audi->year1 = $request->year1;
                $data_audi->year2 = $request->year2;
                $data_audi->year3 = $request->year3;
                $data_audi->year4 = $request->year4;
                $data_audi->tipo_audi = 2;
                $data_audi->save();
                return ['success'=>'ok'];
            }
            else{
                return ['error'=>'La suma de los 4 años de ejecución no debe superar 100'];
            }       
        }
        else{
            return ['error'=>'Este nombre ya ha sido asignado a otra área'];
        }
    }

   public function deleteProject(Request $request){
        $sessionUser = Auth::user()->name;
        $password = $request->deletePassword;
        if (Auth::attempt(['name' => $sessionUser, 'password' => $password])){
            $product_indicators = Product_indicator::select('*')
                                ->where('project', $request->id)
                                ->get();
            if (count($product_indicators) == 0) {
                $data = Project::find($request->id);
                $data_audi = new Audi_Project;
                $data_audi->name = $data->name;
                $data_audi->description = $data->description;
                $data_audi->weight = $data->weight;
                $data_audi->program = $data->program;
                $data_audi->budget = $data->budget;
                $data_audi->dependence = $data->dependence;
                $data_audi->year1 = $data->year1;
                $data_audi->year2 = $data->year2;
                $data_audi->year3 = $data->year3;
                $data_audi->year4 = $data->year4;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 4;
                $data_audi->save();
                $data->delete();
                return ['success'=>'ok'];
            }
            else{
                if ($request->reassignProjectId) {
                    if($request->reassignProjectId != $request->id){
                        $data = Project::find($request->id);
                        if(count($data) > 0){
                            DB::beginTransaction();
                            $count = 0;
                            $valid = 0;
                            foreach ($product_indicators as $update) {
                                $program = Product_indicator::find($update->id);
                                $program->project = $request->reassignProjectId;
                                $program->weight = 0;
                                $data_audi = new Audi_Product_indicator;
                                $data_audi->name = $program->name;
                                $data_audi->goal = $program->goal;
                                $data_audi->unit = $program->unit;
                                $data_audi->weight = 0;
                                $data_audi->area = $request->reassignProjectId;
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
                            $data = Project::find($request->id);
                            $data_audi = new Audi_Project;
                            $data_audi->name = $data->name;
                            $data_audi->description = $data->description;
                            $data_audi->weight = $data->weight;
                            $data_audi->program = $data->program;
                            $data_audi->budget = $data->budget;
                            $data_audi->dependence = $data->dependence;
                            $data_audi->year1 = $data->year1;
                            $data_audi->year2 = $data->year2;
                            $data_audi->year3 = $data->year3;
                            $data_audi->year4 = $data->year4;
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
                        return ['error'=> 'No puedes reasignar en el proyecto a borrar'];
                    }
                }
                else{
                    return ['reassign'=>'Este proyecto tiene indicador(es) asociados, para eliminar debe reasignarlas a otro proyecto'];
                }
            }
        }
        else{
            return ['error'=>'La contraseña es erronea'];
        }
    }
}
