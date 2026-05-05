<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    // GET /api/projects/{project}/tasks
    public function index(Project $project): AnonymousResourceCollection
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()
            ->withCount('comments')
            ->get();

        return TaskResource::collection($tasks);
    }

    // POST /api/projects/{project}/tasks
    public function store(StoreTaskRequest $request, Project $project): TaskResource
    {
        $this->authorize('view', $project);

        // Set position to end of the column by default
        $position = $project->tasks()
            ->where('status', $request->validated('status', 'todo'))
            ->max('position') + 1;

        $task = $project->tasks()->create([
            ...$request->validated(),
            'user_id'  => $request->user()->id,
            'position' => $position,
        ]);

        return new TaskResource($task);
    }

    // PATCH /api/tasks/{task}
    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return new TaskResource($task);
    }

    // PATCH /api/tasks/{task}/reorder
    // Called on every drag-and-drop drop event
    public function reorder(ReorderTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $newStatus   = $request->validated('status');
        $newPosition = $request->validated('position');

        // Shift everything in the target column down to make room
        Task::where('project_id', $task->project_id)
            ->where('status', $newStatus)
            ->where('position', '>=', $newPosition)
            ->where('id', '!=', $task->id)
            ->increment('position');

        $task->update([
            'status'   => $newStatus,
            'position' => $newPosition,
        ]);

        return response()->json(null, 204);
    }

    // DELETE /api/tasks/{task}
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }
}