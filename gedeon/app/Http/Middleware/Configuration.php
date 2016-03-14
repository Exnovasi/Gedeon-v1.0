<?php

namespace Gedeon\Http\Middleware;

use Closure;
use Auth;
class Configuration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!Auth::check()){
            $error = json_encode(['error'=>'Tu sesión a caducado']);
            die($error);
        }
        else{
            $idrole = Auth::user()->role;
            if($idrole > 3 || $idrole < 1){
                $error = json_encode(['error'=>'No tienes permisos para este módulo']);
                die($error);
            }
        }
        return $next($request);
    }
}
