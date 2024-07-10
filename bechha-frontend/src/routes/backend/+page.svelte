<script lang="ts">
  import { onMount } from 'svelte';

  interface Task {
    id: number;
    name: string;
    status: string;
    steps: string[];
  }

  let tasks: Task[] = [];

  onMount(() => {
    tasks = [
      { id: 1, name: 'Generate Frames', status: 'active', steps: ['Frame Extraction', 'Image Processing'] },
      { id: 2, name: 'YOLO Tags', status: 'completed', steps: ['YOLO Detection', 'Tagging'] },
    ];
  });

  const getStatusBadge = (status: string) => {
    return status === 'completed' ? 'badge-success' : 'badge-warning';
  };
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <h1 class="text-4xl font-bold mb-4 text-center text-blue-600">Backend Task Management</h1>

  <div class="space-y-6">
    {#each tasks as task}
      <div class="card bg-white shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{task.name}</h2>
          <div class="badge {getStatusBadge(task.status)}">{task.status}</div>
          <ul class="mt-4 list-disc list-inside">
            {#each task.steps as step}
              <li>{step}</li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>
</div>
