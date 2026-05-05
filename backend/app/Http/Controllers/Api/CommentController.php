<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Task;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    // GET /api/tasks/{task}/comments
    public function index(Task $task): AnonymousResourceCollection
    {
        $this->authorize('view', $task->project);

        $comments = $task->comments()->with('user')->get();

        return CommentResource::collection($comments);
    }

    // POST /api/tasks/{task}/comments
    public function store(StoreCommentRequest $request, Task $task): CommentResource
    {
        $this->authorize('view', $task->project);

        $comment = $task->comments()->create([
            'body'    => $request->validated('body'),
            'user_id' => $request->user()->id,
        ]);

        return new CommentResource($comment->load('user'));
    }
}