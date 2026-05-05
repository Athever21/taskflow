<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'body'       => $this->body,
            'created_at' => $this->created_at->diffForHumans(),
            // Embed the user inline — avoids a second API call from the frontend
            'user'       => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
        ];
    }
}