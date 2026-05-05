<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'sometimes' means: only validate this field if it's present in the request
            // This is what makes PATCH work — you can send just the fields you want to change
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status'      => ['sometimes', Rule::in(['todo', 'in_progress', 'done', 'cancelled'])],
            'priority'    => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'due_date'    => 'sometimes|nullable|date',
        ];
    }
}