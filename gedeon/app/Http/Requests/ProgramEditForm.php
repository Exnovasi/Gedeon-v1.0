<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class ProgramEditForm extends Request
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
            'objective' => 'required',
            'weight' => 'numeric|max:100',
            'tags' => 'required',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'Por favor ingrese un nombre',
            'objective.required' => 'Por favor ingrese el objetivo',
            'weight.numeric' => 'Por favor ingrese un número',
            'weight.max' => 'El peso del programa debe ser menor a 100',
            'tags.required' => 'Por favor ingrese al menos un indicador',
        ];
    }
}
