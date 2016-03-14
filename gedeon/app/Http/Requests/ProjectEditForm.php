<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class ProjectEditForm extends Request
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
            'description' => 'required',
            'weight' => 'numeric|max:100',
            'program' => 'required',
            'budget' => 'required',
            'dependence' => 'required',
            'years_sum' => 'numeric|max:100',

        ];
       /* for($i = 1; $i <= 4; $i++)
        {
            $sumvalue =
                $this->request->get('year1')[$i] +
                $this->request->get('year2')[$i] +
                $this->request->get('year3')[$i] +
                $this->request->get('year4')[$i];

            $this->merge('year'.$i = $sumvalue);
            
            $rules['year.'.$i] = 'max:100';
        return $rules;
        }*/
    }

    public function messages(){
        return [
            'name.required' => 'Por favor ingrese un nombre',
            'description.required' => 'Por favor ingrese la descripción',
            'weight.required' => 'Por favor ingrese un valor',
            'weight.numeric' => 'Por favor ingrese un número',
            'weight.max' => 'El peso debe ser un número menor a 100',
            'years_sum.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year2.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year3.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'year4.max' => 'La suma de los 4 años de ejecución no debe superar 100',
            'program.required' => 'Por favor ingrese un programa',
            'budget.required' => 'Por favor ingrese un presupuesto',
            'dependence.required' => 'Por favor seleccione una dependencia',
        ];
    }
}
