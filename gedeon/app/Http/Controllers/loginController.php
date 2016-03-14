<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Registrar;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Auth;
use Mail;
use Session;
use Hash;
use Gedeon\Http\Requests\LoginForm;
//use User;
use Gedeon\User;
use Gedeon\Dependence;
use Gedeon\Permission;

class loginController extends Controller
{
    public function check(Request $request){
    	if(Auth::check()){
            $idrole = Auth::user()->role;
            $session = [
                         'user' => Auth::user()->name,
                         'role' => Auth::user()->role,
                         'dependenceName' => Dependence::select('name')->where('id', Auth::user()->dependence)->pluck('name')[0],
                         'view' => Permission::where('id_rol', '=', $idrole)->pluck('view'),
                         'create' => Permission::where('id_rol', '=', $idrole)->pluck('create'),
                         'edit' => Permission::where('id_rol', '=', $idrole)->pluck('edit'),
                         'delete' => Permission::where('id_rol', '=', $idrole)->pluck('delete'),
                       ];
            return $session;

        }
        else{
            $message = ['error' => 'guest'];
            return $message;
    	}
    }


    public function login(LoginForm $request){
        $user = $request->input('user');
        $password = $request->input('password');
        if (Auth::attempt(['name' => $user, 'password' => $password])){
            if (Auth::user()->enabled == 1) {
                $user_name = ['name'=> User::where('name', '=', $user)->pluck('name')];
                /*session(['user' => User::where('name', '=', $user)->pluck('name')]);
                $request->session()->put('user',  User::where('name', '=', $user)->pluck('name'));*/
                return $user_name;
            }
            else{
                return ['error' => 'Su cuenta no esta activada'];
            }
        }
        else{
            return ['error' => 'El usuario o la Contraseña no son correctos'];
        }
    }

    /**
     * Log the user out of the application.
     *
     */
    public function logout()
    {
        //$request->session()->flush();
        Auth::logout();
        //Route::post('logout', 'loginController@logout');

        return ['success' => 'sesíon finalizada'];
    }

}
