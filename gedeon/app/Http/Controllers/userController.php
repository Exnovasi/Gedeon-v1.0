<?php

namespace Gedeon\Http\Controllers;

use Illuminate\Http\Request;

use Gedeon\Http\Requests;
use Gedeon\Http\Controllers\Controller;
use Gedeon\Http\Requests\CreateUserForm;
use Gedeon\Http\Requests\EditUserForm;
use Hash;
use Auth;
use DB;
use Gedeon\User;
use Gedeon\Dependence;
use Gedeon\Role;
use Gedeon\Audi_Users;
use Gedeon\Audi_Project;

class userController extends Controller
{
    public function viewUsers(){
        $users = User::select('users.id as id', 'users.name as name', 'users.email as email', 'users.telephone as telephone', 'users.avatar as avatar', 'users.dependence as dependence', 'users.role as role', 'dependences.name as dependencename', 'roles.name as rolename', 'users.enabled as enabled')
            ->join('dependences', 'users.dependence', '=', 'dependences.id')
            ->join('roles', 'users.role', '=', 'roles.id')
            ->get();
        return $users;
    }
    public function viewUser(Request $request){
        $users = User::find($request->id);
        return $users;
    }

    
    public function createUser(CreateUserForm $request){
        if(Auth::check()){

            //validamos si el avatar es la imagen por defecto o el usuario subio una imagen
            $idUnique = time();
            if ($request->avatar =='img/img_profile_users/default-avatar2.jpg') {

               $fileName = $request->avatar;
            }
            else{
                
                list(, $request->avatar) = explode(';', $request->avatar);
                list(, $request->avatar) = explode(',', $request->avatar);
                //Decodificamos $request->avatar codificada en base64.
                $avatar = base64_decode($request->avatar);
                $fileName = "img/img_profile_users/" . $idUnique . "-" . $request->name .".jpg";
                //escribimos la información obtenida en un archivo llamado 
                //$idUnico = time().jpg para que se cree la imagen correctamente
                file_put_contents($fileName, $avatar); //se crea la imagen en la ruta  
            }
  
            $sessionUser = Auth::user()->name;        
            $user = new User;
            $user->name = $request->name;
            $user->email = $request->email;
            $user->telephone = $request->telephone;
            $user->avatar = $fileName;
            $user->enabled = 1;
            $user->dependence = $request->dependence;
            $user->role = $request->role;
            $user->password =  Hash::make($request->password);
            $user->save();
            $audi_users = new Audi_Users;
            $audi_users->name = $request->name;
            $audi_users->email = $request->email;
            $audi_users->enabled = 1;
            $audi_users->telephone = $request->telephone;
            $audi_users->avatar = $fileName;
            $audi_users->dependence = $request->dependence;
            $audi_users->role = $request->role;
            $audi_users->password =  Hash::make($request->password);
            $audi_users->id_user = Auth::user()->id;
            $audi_users->tipo_audi = 1;
            $audi_users->save();
            foreach ($request->tags as $pj) {
                $pj['text'] = str_replace('-', ' ', $pj['text']);
                DB::table('projects')
                    ->where('name', $pj['text'])
                    ->update(['operative' => $user->id]);
                $data_audi = new Audi_Project;
                $data_audi->name = $pj['text'];
                $data_audi->operative = $user->id;
                $data_audi->id_user = Auth::user()->id;
                $data_audi->tipo_audi = 2;
                $data_audi->save();
            }
            $user->dependencename = Dependence::select('name')
                        ->where('id', $request->dependence)->pluck('name')[0];
            $user->rolename = Role::select('name')
                    ->where('id', $request->role)->pluck('name')[0];

           return ['success'=>$user];
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }


    public function editUser(EditUserForm $request){
        if($request->password == $request->password_confirmation){
            $valid = User::select('id')
                        ->where('email', $request->email)
                        ->where('id', '<>' , $request->id)
                        ->get();
            if(count($valid) <= 0){
                $user = User::find($request->id);
                $user->name = $request->name;
                $user->email = $request->email;
                $user->telephone = $request->telephone;
                $user->dependence = $request->dependenceid;
                $user->role = $request->roleid;
                $user->password =  Hash::make($request->password);
                $user->save();
                $audi_users = new Audi_Users;
                $audi_users->name = $request->name;
                $audi_users->email = $request->email;
                $audi_users->telephone = $request->telephone;
                $audi_users->dependence = $request->dependenceid;
                $audi_users->role = $request->roleid;
                $audi_users->password =  Hash::make($request->password);
                $audi_users->id_user = Auth::user()->id;
                $audi_users->tipo_audi = 2;
                $audi_users->save();
                return ['success'=>'ok'];
            }
            else{
                return ['error'=>'Este correo ya esta asignado a otro usuario'];
            }
        }
        else{
            return ['error'=>'Las contraseñas no coinciden'];
        }
    }

    /*edita el avatar de un usuario ya creado y borra el anterior archivo*/
    public function editAvatar(EditUserForm $request){
        if(Auth::check()){
            $valid = User::select('id')
                        ->where('email', $request->email)
                        ->where('id', '<>' , $request->id)
                        ->get();
            if(count($valid) <= 0){

                $user = User::find($request->id);
                $oldAvatar = $user->avatar;    

                if ($request->avatar == $oldAvatar){

                   $fileName = $request->avatar;
                }
                else{

                    if ( $oldAvatar =='img/img_profile_users/default-avatar2.jpg') {

                       $idUnique = time();
                        list(, $request->avatar) = explode(';', $request->avatar);
                        list(, $request->avatar) = explode(',', $request->avatar);
                        //Decodificamos $request->avatar codificada en base64.
                        $avatar = base64_decode($request->avatar);
                        $fileName = "img/img_profile_users/" . $idUnique . "-" . $request->name .".jpg";
                        //escribimos la información obtenida en un archivo llamado 
                        //$idUnico = time().jpg para que se cree la imagen correctamente
                        file_put_contents($fileName, $avatar); //se crea la imagen en la ruta 
                    }
                    else{
                    
                        $idUnique = time();
                        list(, $request->avatar) = explode(';', $request->avatar);
                        list(, $request->avatar) = explode(',', $request->avatar);
                        //Decodificamos $request->avatar codificada en base64.
                        $avatar = base64_decode($request->avatar);
                        $fileName = "img/img_profile_users/" . $idUnique . "-" . $request->name .".jpg";
                        unlink($oldAvatar);
                        //escribimos la información obtenida en un archivo llamado 
                        //$idUnico = time().jpg para que se cree la imagen correctamente
                        file_put_contents($fileName, $avatar); //se crea la imagen en la ruta 
                    };
                }  

                $sessionUser = Auth::user()->name;
                //$user = User::find($request->id);
                $user->name = $request->name;
                $user->email = $request->email;
                $user->telephone = $request->telephone;
                $user->dependence = $request->dependence;
                $user->role = $request->role;
                $user->avatar = $fileName;
                $user->save();
                $audi_users = new Audi_Users;
                $audi_users->name = $request->name;
                $audi_users->email = $request->email;
                $audi_users->telephone = $request->telephone;
                $audi_users->dependence = $request->dependence;
                $audi_users->role = $request->role;
                $audi_users->avatar = $fileName;
                $audi_users->id_user = Auth::user()->id;
                $audi_users->tipo_audi = 2;
                $audi_users->save();
               return ['success'=>'ok'];
            }else{
                return ['error'=>'Este correo ya esta asignado a otro usuario'];
            }
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }

    public function editUserPartial(EditUserForm $request){
        if(Auth::check()){
            $valid = User::select('id')
                        ->where('email', $request->email)
                        ->where('id', '<>' , $request->id)
                        ->get();
            if(count($valid) <= 0){
                $sessionUser = Auth::user()->name;
                $user = User::find($request->id);        
                $user->name = $request->name;
                $user->email = $request->email;
                $user->telephone = $request->telephone;
                $user->dependence = $request->dependence;
                $user->role = $request->role;
                $user->save();
                $audi_users = new Audi_Users;
                $audi_users->name = $request->name;
                $audi_users->email = $request->email;
                $audi_users->telephone = $request->telephone;
                $audi_users->dependence = $request->dependence;
                $audi_users->role = $request->role;
                $audi_users->id_user = Auth::user()->id;
                $audi_users->tipo_audi = 2;
                $audi_users->save();
                $user->dependencename = Dependence::select('name')
                        ->where('id', $request->dependence)->pluck('name')[0];
                $user->rolename = Role::select('name')
                        ->where('id', $request->role)->pluck('name')[0];
                return ['success'=>$user];
            }else{
                return ['error'=>'Este correo ya esta asignado a otro usuario'];
            }
        }
        else{
            return ['error'=>'no se pudo completar la operacion'];
        }
    }


    public function enabledUser(Request $request){
        if($request->enabled == 0)
            $request->enabled = 0;
        else
            $request->enabled = 1;
        $user = User::find($request->id);
        $user->enabled = $request->enabled;
        $user->save();
        $audi_users = new Audi_Users;
        $audi_users->name = $user->name;
        $audi_users->email = $user->email;
        $audi_users->telephone = $user->telephone;
        $audi_users->password =  Hash::make($user->password);
        $audi_users->id_user = Auth::user()->id;
        $audi_users->tipo_audi = 3;
        $audi_users->enabled = $request->enabled;
        $audi_users->save();
        return ['msg'=>'ok'];
    }

    
}
