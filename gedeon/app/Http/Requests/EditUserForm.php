<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class EditUserForm extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "name" => "required",
            "email" => "required|email",
            "telephone" => "required|numeric|min:10",
            "avatar" => "required",
            "dependence" => "required",
            "role" => "required"
        ];
    }
    public function messages(){
        return [
            'name.required' => 'Por favor ingrese el nombre de usuario',
            'email.required' => 'Por favor ingrese el correo',
            'email.email' => 'Por favor ingrese un correo valido',
            'telephone.numeric' => 'Por favor ingrese un numero',
            'telephone.required' => 'Por favor ingrese un numero de telefono',
            'telephone.min' => 'Por favor ingrese un numero de telefono valido',
            'avatar.required' => 'Por favor cargue una imagen',
            'dependence.required' => 'Por favor seleccione una dependencia',
            'role.required' => 'Por favor seleccione un rol'
        ];
    }
}

