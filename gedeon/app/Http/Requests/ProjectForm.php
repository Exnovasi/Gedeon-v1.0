<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class ProjectForm extends Request
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
            "name" => "required|unique:projects",
            'description' => 'required',
            'weight' => 'numeric|max:100',
            'program' => 'required',
            'budget' => 'required',
            'dependence' => 'required',
            'year1' => 'numeric',
            'year2' => 'numeric',
            'year3' => 'numeric',
            'year4' => 'numeric',
        ];

       /* for($i = 1; $i <= 4; $i++)
        {
            $sumvalue =
                $this->request->get('year1')[$i] +
                $this->request->get('year2')[$i] +
                $this->request->get('year3')[$i] +
                $this->request->get('year4')[$i];

            $this->merge('year'.$i = $value);
            
            $rules['year.'.$i] = 'max:100';
        }*/

        return $rules;
    }

    public function messages(){
        return [
            'name.required' => 'Por favor ingrese un nombre',
            'description.required' => 'Por favor ingrese el objetivo',
            'weight.required' => 'Por favor ingrese un valor',
            'weight.numeric' => 'Por favor ingrese un número',
            'weight.max' => 'por favor ingrese un número menor a 100',
            'program.required' => 'Por favor ingrese un programa',
            'name.unique' => 'Este nombre ya es usado por otro projecto',
            'budget.required' => 'Por favor ingrese un presupuesto',
            'dependence.required' => 'Por favor seleccione una dependencia',
            'year1.numeric' => 'Por favor ingrese un número en el año 1',
            'year2.numeric' => 'Por favor ingrese un número en el año 2',
            'year3.numeric' => 'Por favor ingrese un número en el año 3',
            'year4.numeric' => 'Por favor ingrese un número en el año 4',
            /*'year1.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year2.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year3.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year4.max' => 'La suma de los 4 años de ejecución no debe superar 100',*/
            //'year1.required' => 'Por favor ingrese el año 1',
            //'year2.required' => 'Por favor ingrese el año 2',
            //'year3.required' => 'Por favor ingrese el año 3',
            //'year4.required' => 'Por favor ingrese el año 4',
        ];
    }
}
