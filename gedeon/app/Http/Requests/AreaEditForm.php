<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class AreaEditForm extends Request
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
                'weight' => 'required|numeric|max:100',
                'line' => 'required',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'Por favor ingrese un nombre',
            'objective.required' => 'Por favor ingrese el objetivo',
            'weight.required' => 'Por favor ingrese un valor',
            'weight.numeric' => 'Por favor ingrese un número',
            'weight.max' => 'por favor ingrese un número menor a 100',
            'line.required' => 'Por favor ingrese una línea',
        ];
    }
}
