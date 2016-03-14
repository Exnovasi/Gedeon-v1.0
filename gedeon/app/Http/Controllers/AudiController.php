<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Audi_Line;
use Gedeon\Audi_Area;
use Gedeon\Audi_Result_Indicator;
use Gedeon\Audi_Program;
use Gedeon\Audi_Project;
use Gedeon\Audi_Product_Indicator;
use Gedeon\Audi_Users;
use Gedeon\Audi_Dependence;
use Gedeon\User;
use Auth;
use DB;

class AudiController extends Controller
{
	public function viewAudits(){
	    if(Auth::user()->role <= 3){
	        $line = Audi_Line::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($line as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." la linea '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => 0
	        				);
	        }
	        $area = Audi_Area::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($area as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el área '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => 0
	        				);
	        }
	        $ri = Audi_Result_Indicator::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($ri as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el indicador de resultado '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => 0
	        				);
	        }
	        $program = Audi_Program::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($program as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el programa '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => 0
	        				);
	        }
	        $project = Audi_Project::select('id as id', 'tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user', 'dependence as dependence')
	        		->get();
	        foreach ($project as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el projecto '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => $data->dependence,
	        					'project' => $data->id
	        				);
	        }
	        $pr = Audi_Product_Indicator::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user', 'project as project')
	        		->get();
	        foreach ($pr as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el indicador de producto '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => $data->project
	        				);
	        }
	        $user = Audi_Users::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($user as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." el usuario '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => $user[0]->dependence,
	        					'project' => 0
	        				);
	        }
	        $user = Audi_Dependence::select('tipo_audi as tipo_audi', 'name as name', 'created_at as date', 'id_user as id_user')
	        		->get();
	        foreach ($user as $data) {
	        	$tipo = '';
	        	if($data->tipo_audi == 1){
	        		$tipo = 'creó';
	        		$type = 'success';
	        	}
	        	if($data->tipo_audi == 2){
	        		$tipo = 'editó';
	        		$type = 'info';
	        	}
	        	if($data->tipo_audi == 3){
	        		$tipo = 'cambió estado';
	        		$type = 'warning';
	        	}
	        	if($data->tipo_audi == 4){
	        		$tipo = 'eliminó';
	        		$type = 'danger';
	        	}
	        	$user = User::select('name','dependence')
	        			->where('id', $data->id_user)
	        			->get();
	        	$msg = "Se ".$tipo." la dependencia '".$data->name."' por el usuario ".$user[0]->name;
	        	$audi[] = array(
	        					'msg' => $msg,
	        					'type' => $type,
	        					'date' => $data->date,
	        					'user' => $data->id_user,
	        					'dependence' => 0,
	        					'project' => 0
	        				);
	        }
	        return $audi;
	    }  
	}
}
