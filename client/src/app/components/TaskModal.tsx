import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface TaskModalProps {
  setOpenTaskModal: (isOpen: boolean) => void;
  // onTaskAdded: () => void;
}

export default function TaskModal({
  setOpenTaskModal,
}: // onTaskAdded,
TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Form data = ', formData);

    try {
      // Using JSONPlaceholder as a dummy API
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      console.log('Response = ', response);

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      console.log('Task created:', data);
      setOpenTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>New Task</h2>
          <button
            type='button'
            className='bg-red-500 rounded-lg px-3 py-1 text-white hover:bg-red-600 transition'
            onClick={() => setOpenTaskModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm'
              placeholder='Task Title'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm'
              placeholder='Task Description'
            />
          </div>

          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700'
            >
              Status
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm'
            >
              <option value='todo'>Todo</option>
              <option value='in_progress'>In Progress</option>
              <option value='completed'>Complete</option>
            </select>
          </div>
        </div>

        <button
          type='submit'
          className='mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
