<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'status'         => $this->status,
            'priority'       => $this->priority,
            'position'       => $this->position,
            'due_date'       => $this->due_date?->toDateString(),  // null-safe, returns "2024-12-31"

            // Computed on the server — frontend doesn't need to know about dates
            'is_overdue'     => $this->due_date?->isPast() && $this->status !== 'done',

            'comments_count' => $this->whenCounted('comments'),
            'created_at'     => $this->created_at->diffForHumans(), // "3 hours ago"
        ];
    }
}