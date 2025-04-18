import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';

export default function DraggableItem({ id, task }: any) {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const router = useRouter();

  const handleDelete = async (id: string) => {
    console.log('Delete task', id);
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    } finally {
      router.refresh();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // {...listeners}
      {...attributes}
      className='bg-white p-3 rounded '
    >
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <div
            {...listeners}
            className='cursor-move text-gray-400'
            title='Drag'
          >
            ☰
          </div>
          <h2>{task.title}</h2>
        </div>
        <span
          className='text-red-500 text-xs font-semibold cursor-pointer'
          onClick={(e) => handleDelete(task.id)}
        >
          X
        </span>
      </div>
      <p>-{task.description}</p>
    </div>
  );
}
