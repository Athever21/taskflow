<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    // authorize() runs before rules() — return false to reject the request entirely
    // Here we just check the user is logged in (the route middleware handles that,
    // but it's good practice to be explicit)
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/', // valid hex color
        ];
    }
}