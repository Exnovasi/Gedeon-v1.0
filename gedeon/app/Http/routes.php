<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::group(['middleware' => 'webCheck'], function () {
	Route::get('/', function () {
	    return view('welcome');
	});
	Route::get('loginCheck', 'loginController@check');
	Route::post('login', 'loginController@login');
	Route::post('logout', 'loginController@logout');
});
Route::group(['middleware' => 'webAdmin'], function () {
	Route::get('viewUsers', 'userController@viewUsers');
	Route::get('viewUser', 'userController@viewUser');
	Route::post('createUser', 'userController@createUser');
	Route::post('editUser', 'userController@editUser');
	Route::post('editUserPartial', 'userController@editUserPartial');
	Route::post('editAvatar', 'userController@editAvatar');
	Route::post('enabledUser', 'userController@enabledUser');
	Route::post('deleteUser', 'userController@deleteUser');
});
Route::group(['middleware' => 'webConfig'], function () {
	Route::get('viewDependences', 'dependenceController@viewDependences');
	Route::get('viewDependence', 'dependenceController@viewDependence');
	Route::post('createDependence', 'dependenceController@createDependence');
	Route::post('editDependence', 'dependenceController@editDependence');
	Route::post('deleteDependence', 'dependenceController@deleteDependence');
	Route::post('editImgDevPlan', 'developmentPlanController@editImgDevPlan');
	Route::post('createDevelopmentPlan', 'developmentPlanController@createDevelopmentPlan');
	Route::get('viewLines', 'LineController@viewLines');
	Route::post('viewLine', 'LineController@viewLine');
	Route::post('createLine', 'LineController@createLine');
	Route::post('editLine', 'LineController@editLine');
	Route::post('deleteLine', 'LineController@deleteLine');
	Route::get('viewLinesComplete', 'AreaController@viewLinesComplete');
	Route::post('viewAreas', 'AreaController@viewAreas');
	Route::post('viewArea', 'AreaController@viewArea');
	Route::post('viewIndicatorForArea', 'ProgramController@viewIndicatorForArea');
	Route::post('createArea', 'AreaController@createArea');
	Route::post('editArea', 'AreaController@editArea');
	Route::post('deleteArea', 'AreaController@deleteArea');
	Route::get('viewPrograms', 'ProgramController@viewPrograms');
	Route::post('viewProgram', 'ProgramController@viewProgram');
	Route::post('viewProgramForName', 'ProgramController@viewProgramForName');
	Route::post('viewProgramForNameInArea', 'ProgramController@viewProgramForNameInArea');
	Route::post('createProgram', 'ProgramController@createProgram');
	Route::post('editProgram', 'ProgramController@editProgram');
	Route::post('deleteProgram', 'ProgramController@deleteProgram');
	Route::get('viewProjects', 'ProjectController@viewProjects');
	Route::get('viewProjectsDetails', 'ProjectController@viewProjectsDetails');
	Route::post('viewProjectForDependence', 'ProjectController@viewProjectForDependence');
	Route::post('viewProject', 'ProjectController@viewProject');
	Route::post('createProject', 'ProjectController@createProject');
	Route::post('editProject', 'ProjectController@editProject');
	Route::post('deleteProject', 'ProjectController@deleteProject');
	Route::post('viewResultIndicator', 'resultIndicatorController@viewResultIndicator');
	Route::post('createIndicator', 'resultIndicatorController@createIndicator');
	Route::post('editIndicator', 'resultIndicatorController@editIndicator');
	Route::post('deleteIndicator', 'resultIndicatorController@deleteIndicator');
	Route::post('viewProductIndicador', 'productIndicatorController@viewProductIndicador');
	Route::post('createIndicatorProduct', 'productIndicatorController@createIndicatorProduct');
	Route::post('editIndicatorProduct', 'productIndicatorController@editIndicatorProduct');
	Route::post('deleteIndicatorProduct', 'productIndicatorController@deleteIndicatorProduct');
});
Route::group(['middleware' => 'web'], function () {	
	// Route::get('viewRoles', 'rolesController@viewRoles');
	// Route::get('viewRol', 'rolesController@viewRol');
	// Route::post('createRol', 'rolesController@createRol');
	// Route::post('editRol', 'rolesController@editRol');
	// Route::post('deleteRol', 'rolesController@deleteRol');
	Route::get('loadProjectsUser', 'ProjectController@loadProjectsUser');
	Route::get('viewDevelopmentPlan', 'developmentPlanController@viewDevelopmentPlan');
	Route::get('viewTreeDevelopmentPlan', 'developmentPlanController@viewTreeDevelopmentPlan');
	Route::get('viewAudits', 'AudiController@viewAudits');	
});

Route::get('/loginf', function(Request $request)
{
  /*if(Auth::attempt(Request::only('user','password'))){
	return Auth::user();
	}else{
	return 'invalid username/pass combo';
}*/
/*$user = Request::header();
*/
return $request;

});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});
