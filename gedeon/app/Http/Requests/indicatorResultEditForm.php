<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class indicatorResultEditForm extends Request
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
            'goal' => 'required',
            'weight' => 'numeric|max:100',
            'area' => 'required',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'Por favor ingrese un nombre',
            'objective.required' => 'Por favor ingrese la meta',
            'weight.numeric' => 'Por favor ingrese un número',
            'weight.max' => 'El peso del programa debe ser menor a 100',
            'area.required' => 'Por favor ingrese un area',
        ];
    }
}
