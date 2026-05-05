<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    // GET /api/projects
    public function index(Request $request): AnonymousResourceCollection
    {
        $projects = $request->user()
            ->projects()
            ->withCount('tasks') // adds tasks_count to each project — no extra query
            ->latest()
            ->get();

        return ProjectResource::collection($projects);
    }

    // POST /api/projects
    public function store(StoreProjectRequest $request): ProjectResource
    {
        $project = $request->user()
            ->projects()
            ->create($request->validated());

        return new ProjectResource($project);
    }

    // DELETE /api/projects/{project}
    public function destroy(Request $request, Project $project): JsonResponse
    {
        // Make sure the authenticated user owns this project
        // Without this check, any logged-in user could delete anyone's project
        $this->authorize('delete', $project);

        $project->delete(); // cascades to tasks and comments via DB constraints

        return response()->json(null, 204);
    }
}