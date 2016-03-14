<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class LoginForm extends Request
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
            "user" => "required",
            "password" => "required"
        ];
    }
    public function messages(){
        return [
            'user.required' => 'Por favor ingrese el nombre de usuaridasdadsas',
            'password.required' => 'Por favor ingrese la clave'
        ];
    }
}
