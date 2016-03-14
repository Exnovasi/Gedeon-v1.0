<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class CreateRolForm extends Request
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
            "name" => "required|unique:dependences"
        ];
    }
    public function messages(){
        return [
            'name.required' => 'Por favor ingrese el nombre de la dependencia',
            'name.unique' => 'Ya existe una dependencia con este nombre'
        ];
    }
}
