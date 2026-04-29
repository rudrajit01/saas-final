import { NextRequest, NextResponse } from "next/server";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

let sampleTasks: Task[] = [
  { id: 1, title: "Sample task 1", completed: false },
  { id: 2, title: "Sample task 2", completed: true },
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);
  const body = await request.json();

  const task = sampleTasks.find((item) => item.id === taskId);

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  task.completed = Boolean(body?.completed);

  return NextResponse.json(task, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);

  const existingTask = sampleTasks.find((item) => item.id === taskId);

  if (!existingTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  sampleTasks = sampleTasks.filter((item) => item.id !== taskId);

  return NextResponse.json(
    { message: "Task deleted successfully" },
    { status: 200 }
  );
}

