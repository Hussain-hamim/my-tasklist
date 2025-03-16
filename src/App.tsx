import React, { useState } from 'react';
import { MoreHorizontal, Plus, X, Search, Bell } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

interface Task {
  id: string;
  title: string;
  assignee: {
    avatar: string;
    date: string;
  };
  tag: {
    name: string;
    color: string;
  };
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

function App() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      title: 'To do',
      tasks: [],
      color: 'bg-blue-50/80 backdrop-blur-sm',
    },
    {
      id: '2',
      title: 'In Progress',
      tasks: [
        {
          id: '1',
          title: 'Add buttons',
          assignee: {
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            date: 'Yesterday',
          },
          tag: {
            name: 'Programming',
            color: 'text-gray-400',
          },
        },
        {
          id: '2',
          title: 'Logo revision',
          assignee: {
            avatar:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            date: 'Tomorrow',
          },
          tag: {
            name: 'Design',
            color: 'text-gray-400',
          },
        },
      ],
      color: 'bg-purple-50/80 backdrop-blur-sm',
    },
    {
      id: '3',
      title: 'Review',
      tasks: [
        {
          id: '3',
          title: 'Empty task',
          assignee: {
            avatar:
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
            date: 'Tomorrow',
          },
          tag: {
            name: 'Design',
            color: 'text-gray-400',
          },
        },
        {
          id: '4',
          title: 'UI-Kit',
          assignee: {
            avatar:
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
            date: 'Tomorrow',
          },
          tag: {
            name: 'Design',
            color: 'text-gray-400',
          },
        },
      ],
      color: 'bg-rose-50/80 backdrop-blur-sm',
    },
  ]);

  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(
    null
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetColumnId = over.id as string;

    // Find the task and its current column
    let sourceColumn: Column | undefined;
    let task: Task | undefined;

    for (const column of columns) {
      const foundTask = column.tasks.find((t) => t.id === taskId);
      if (foundTask) {
        sourceColumn = column;
        task = foundTask;
        break;
      }
    }

    if (!sourceColumn || !task) return;

    // Remove task from source column and add to target column
    setColumns(
      columns.map((column) => {
        if (column.id === sourceColumn?.id) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== taskId),
          };
        }
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, task!],
          };
        }
        return column;
      })
    );
  };

  const handleAddTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      assignee: {
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        date: 'Today',
      },
      tag: {
        name: 'New',
        color: 'text-gray-400',
      },
    };

    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      })
    );

    setNewTaskTitle('');
    setAddingTaskToColumn(null);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const colors = [
      'bg-emerald-50/80',
      'bg-cyan-50/80',
      'bg-fuchsia-50/80',
      'bg-lime-50/80',
    ];

    const newSection: Column = {
      id: Math.random().toString(),
      title: newSectionTitle,
      tasks: [],
      color: colors[columns.length % colors.length] + ' backdrop-blur-sm',
    };

    setColumns([...columns, newSection]);
    setNewSectionTitle('');
    setShowAddSection(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'>
      {/* Header */}
      <div
        className='w-full  bg-fuchsia-50/80 rounded-md border-b border-gray-200'
        style={{ maxWidth: '94%', marginLeft: '3%' }}
      >
        <div className='max-w-[1800px] mx-auto px-4 py-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
                <span className='text-white p-5 text-lg'>A</span>
              </div>
              <div>
                <h1 className='text-sm font-medium'>Apple</h1>
                <p className='text-xs text-gray-500'>5 boards · 24 members</p>
              </div>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='relative'>
                <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors'
                />
              </div>
              <button className='p-1.5 hover:bg-gray-100 rounded-md'>
                <Bell className='w-5 h-5 text-gray-600' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='p-4 md:p-8'>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {columns.map((column, index) => (
              <div
                key={column.id}
                id={column.id}
                className={`${
                  column.color
                } rounded-lg p-4 shadow-sm border border-white/20 ${
                  index === 0 ? 'w-full' : 'w-full'
                }`}
              >
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-medium text-gray-700'>
                    {column.title}
                  </h2>
                  <div className='flex items-center gap-1'>
                    <button
                      className='p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white/30'
                      onClick={() => setAddingTaskToColumn(column.id)}
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                    <button className='p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white/30'>
                      <MoreHorizontal className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <div className='space-y-3'>
                  {addingTaskToColumn === column.id && (
                    <div className='bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm'>
                      <input
                        type='text'
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder='Enter task title...'
                        className='w-full p-2 border rounded-md mb-2 bg-white'
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleAddTask(column.id)
                        }
                      />
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => setAddingTaskToColumn(null)}
                          className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddTask(column.id)}
                          className='px-3 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600'
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      className='bg-white/80 backdrop-blur-sm rounded-lg p-3 space-y-3 shadow-sm hover:shadow-md transition-shadow cursor-move'
                    >
                      <div className='flex items-center justify-between'>
                        <h3 className='text-sm font-medium text-gray-900'>
                          {task.title}
                        </h3>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <img
                            src={task.assignee.avatar}
                            alt='Avatar'
                            className='w-6 h-6 rounded-full'
                          />
                          <span
                            className={`text-xs ${
                              task.assignee.date.toLowerCase() === 'yesterday'
                                ? 'text-red-500'
                                : 'text-blue-500'
                            }`}
                          >
                            {task.assignee.date}
                          </span>
                        </div>
                        <span className='text-xs bg-white/50 px-2 py-1 rounded-full'>
                          {task.tag.name}
                        </span>
                      </div>
                    </div>
                  ))}

                  {column.tasks.length === 0 && !addingTaskToColumn && (
                    <button
                      className='w-full py-4 text-sm text-gray-400 hover:text-gray-600 hover:bg-white/30 rounded-lg transition-colors'
                      onClick={() => setAddingTaskToColumn(column.id)}
                    >
                      + Add task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      </div>

      <button
        onClick={() => setShowAddSection(true)}
        className='fixed bottom-6 right-6 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors'
      >
        <Plus className='w-6 h-6' />
      </button>

      {showAddSection && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-sm'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium'>Add New Section</h3>
              <button
                onClick={() => setShowAddSection(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <input
              type='text'
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder='Enter section title...'
              className='w-full p-2 border rounded-md mb-4'
              onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowAddSection(false)}
                className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800'
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                className='px-4 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600'
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
