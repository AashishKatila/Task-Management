import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import DraggableItem from './DraggableItem';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
}

export default function DroppableArea({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 rounded-lg min-h-[200px] ${
        isOver ? 'bg-blue-100' : 'bg-gray-200'
      }`}
    >
      <h2 className='font-bold text-lg mb-4'>{title}</h2>
      <div className='space-y-2'>
        {tasks.map((item) => (
          <DraggableItem key={item.id} id={item.id} task={item} />
        ))}
      </div>
    </div>
  );
}
