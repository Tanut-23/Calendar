import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

interface Task {
  _id?: ObjectId;
  id?: string;
  title: string;
  description?: string;
  time?: string;
  person: 'nut' | 'nice' | 'both';
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    let query: { date?: string } = {};
    if (date) {
      query.date = date;
    }

    const tasks = await db
      .collection<Task>('tasks')
      .find(query)
      .sort({ date: 1, time: 1 })
      .toArray();

    const formattedTasks = tasks.map((task) => ({
      id: task._id?.toString() || task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      person: task.person,
      date: task.date,
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: Task = await request.json();

    const newTask = {
      title: body.title,
      description: body.description || '',
      time: body.time || '',
      person: body.person,
      date: body.date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tasks').insertOne(newTask);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
