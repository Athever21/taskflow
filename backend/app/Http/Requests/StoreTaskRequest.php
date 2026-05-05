<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => ['nullable', Rule::in(['todo', 'in_progress', 'done', 'cancelled'])],
            'priority'    => ['nullable', Rule::in(['low', 'medium', 'high'])],
            'due_date'    => 'nullable|date',
        ];
    }
}