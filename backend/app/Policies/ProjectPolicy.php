<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

// A Policy centralises "who can do what" for a model.
// Controllers call $this->authorize('view', $project) and Laravel
// automatically finds this class and calls the matching method.
class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }
}