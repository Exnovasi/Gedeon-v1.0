<?php

namespace Gedeon\Http\Requests;

use Gedeon\Http\Requests\Request;

class DevelopmentPlan extends Request
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
            "image" => "required",
        ];
    }

    public function messages(){
        return [
            'image.required' => 'Por favor ingrese una imagen',
        ];
    }
}
