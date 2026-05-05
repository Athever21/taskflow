<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'description', 'color', 'user_id'])]
class Project extends Model
{
    use HasFactory;

    // A project belongs to one user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A project has many tasks. When you load a project, you can do $project->tasks
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('position');
    }
}