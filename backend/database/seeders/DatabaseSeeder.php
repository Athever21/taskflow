<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create a predictable test user so you always know the login
        $user = User::create([
            'name'     => 'Test User',
            'email'    => 'test@test.com',
            'password' => 'password',   // auto-hashed via the $casts in User model
        ]);

        // Create 3 sample projects
        $projects = [
            ['name' => 'TaskFlow App',   'color' => '#6366f1', 'description' => 'The app we are building'],
            ['name' => 'Marketing Site', 'color' => '#10b981', 'description' => 'Company landing page'],
            ['name' => 'Mobile App',     'color' => '#f59e0b', 'description' => 'React Native version'],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create([...$projectData, 'user_id' => $user->id]);

            // Seed tasks across all four statuses so the board looks populated
            $tasks = [
                ['title' => 'Set up project structure',  'status' => 'done',        'priority' => 'high',   'position' => 0],
                ['title' => 'Design database schema',    'status' => 'done',        'priority' => 'high',   'position' => 1],
                ['title' => 'Build auth endpoints',      'status' => 'in_progress', 'priority' => 'high',   'position' => 0],
                ['title' => 'Write API tests',           'status' => 'in_progress', 'priority' => 'medium', 'position' => 1],
                ['title' => 'Build Kanban board UI',     'status' => 'todo',        'priority' => 'high',   'position' => 0],
                ['title' => 'Add drag and drop',         'status' => 'todo',        'priority' => 'medium', 'position' => 1],
                ['title' => 'Deploy to production',      'status' => 'todo',        'priority' => 'low',    'position' => 2],
                ['title' => 'Write documentation',       'status' => 'cancelled',   'priority' => 'low',    'position' => 0],
            ];

            foreach ($tasks as $taskData) {
                $task = Task::create([
                    ...$taskData,
                    'project_id' => $project->id,
                    'user_id'    => $user->id,
                    'due_date'   => now()->addDays(rand(-5, 30)),
                ]);

                // Add a comment to some tasks so that feature has data too
                if (rand(0, 1)) {
                    Comment::create([
                        'body'    => 'Looks good, moving forward with this approach.',
                        'task_id' => $task->id,
                        'user_id' => $user->id,
                    ]);
                }
            }
        }
    }
}