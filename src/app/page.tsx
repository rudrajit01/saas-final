// src/components/Tasks.tsx
"use client";

type Task = {
  id: number;
  title: string;
  dueDate?: string;
};

type TasksProps = {
  tasks: Task[];
};

export default function Tasks({ tasks }: TasksProps) {
  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}