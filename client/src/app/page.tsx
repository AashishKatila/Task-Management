'use client';

import DroppableArea from './components/DroppableArea';
import { DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import TaskModal from './components/TaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
}

export default function Home() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      items: [] as Task[],
    },
    in_progress: {
      id: 'in_progress',
      title: 'In Progress',
      items: [] as Task[],
    },
    completed: {
      id: 'completed',
      title: 'Done',
      items: [] as Task[],
    },
  });

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks'); // Adjust your API endpoint
        const tasks: Task[] = await response.json();
        // console.log('REspinse', response);
        // console.log('Tasks from API', tasks);
        // Transform API data to match your frontend structure
        const newColumns = {
          todo: {
            id: 'todo',
            title: 'To Do',
            items: tasks.filter((task) => task.status === 'todo'),
          },
          in_progress: {
            id: 'in_progress',
            title: 'In Progress',
            items: tasks.filter((task) => task.status === 'in_progress'),
          },
          completed: {
            id: 'completed',
            title: 'Done',
            items: tasks.filter((task) => task.status === 'completed'),
          },
        };

        setColumns(newColumns);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);
  // console.log('Columns = ', columns);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    console.log('Active', active.id);
    console.log('Over =', over);
    if (!over) return;

    // Find source and destination columns
    const sourceColumn = findColumn(active.id);
    const destColumn = over.id;

    console.log('Source column', sourceColumn);
    console.log('Dest column', destColumn);

    if (!sourceColumn || !destColumn || sourceColumn === destColumn) {
      setActiveId(null);
      return;
    }

    const movedTask = columns[sourceColumn as keyof typeof columns].items.find(
      (task) => task.id === active.id
    );

    console.log('Moved tasks: ', movedTask);

    if (!movedTask) {
      setActiveId(null);
      return;
    }

    try {
      let newStatus: Task['status'];
      switch (destColumn) {
        case 'in_progress':
          newStatus = 'in_progress';
          break;
        case 'completed':
          newStatus = 'completed';
          break;
        default:
          newStatus = 'todo';
      }
      setColumns((prev) => {
        const item = movedTask;
        return {
          ...prev,
          [sourceColumn]: {
            ...prev[sourceColumn as keyof typeof prev],
            items: prev[sourceColumn as keyof typeof prev].items.filter(
              (i) => i.id !== item.id
            ),
          },
          [destColumn]: {
            ...prev[destColumn as keyof typeof prev],
            items: [
              ...prev[destColumn as keyof typeof prev].items,
              {
                ...movedTask,
                status: newStatus,
              },
            ],
          },
        };
      });

      // Update task status in the backend
      await fetch(`http://localhost:5000/tasks/${movedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: movedTask.id,
          status: newStatus,
        }),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // Re-fetch data to revert any changes
      const response = await fetch(`http://localhost:5000/tasks`);
      const tasks: Task[] = await response.json();
      setColumns({
        todo: {
          id: 'todo',
          title: 'To Do',
          items: tasks.filter((task) => task.status === 'todo'),
        },
        in_progress: {
          id: 'in_progress',
          title: 'In Progress',
          items: tasks.filter((task) => task.status === 'in_progress'),
        },
        completed: {
          id: 'completed',
          title: 'Done',
          items: tasks.filter((task) => task.status === 'completed'),
        },
      });
    }

    setActiveId(null);
  }

  function findColumn(activeId: string | number) {
    console.log('Item id =', activeId);
    console.log('Columns = ', columns);
    for (const [key, column] of Object.entries(columns)) {
      const foundItem = column.items.some((item) => item.id === activeId);
      if (foundItem) {
        console.log('Found in column:', key);
        console.log('Found item :', foundItem);
        return key;
      }
    }
    console.log('Nothing found');
    return null;
  }

  return (
    <div className='mx-20 mt-10'>
      <h1 className='text-2xl font-bold '>Kanban Board</h1>
      <div className='flex justify-between items-center'>
        <button
          className='bg-green-500 text-white font-semibold m-4 px-4 py-1 rounded-2xl cursor-pointer'
          onClick={() => setOpenTaskModal((prev) => !prev)}
        >
          Add a new task!
        </button>
        <button
          className='bg-green-500 text-white font-semibold m-4 px-4 py-1 rounded-2xl cursor-pointer'
          onClick={() => setOpenTaskModal((prev) => !prev)}
        >
          Add a new project!
        </button>
      </div>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {/* New kanban columns  */}
        <div className='flex gap-4'>
          {Object.values(columns).map((column) => (
            <DroppableArea
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.items}
            />
          ))}
        </div>
        {/* Kanban columns ends  */}
        {openTaskModal && <TaskModal setOpenTaskModal={setOpenTaskModal} />}
      </DndContext>
    </div>
  );
}
