'use client';

import { useState, useRef, useEffect } from 'react';
import './styles.css'; // For Tailwind CSS

// Mock data for users
const USERS = [
  {
    id: 1,
    name: 'Alex',
    initial: 'A',
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Beth',
    initial: 'B',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Carlos',
    initial: 'C',
    image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Diana',
    initial: 'D',
    image: 'https://i.pravatar.cc/150?img=4',
  },
];

// Tags
const TAGS = ['Design', 'Programming', 'Marketing', 'Research'];

function KanbanBoard() {
  // State for columns with initial dummy data
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To do',
      tasks: [],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: 'task-1',
          title: 'Add buttons',
          description: '',
          dueDate: '',
          assignee: USERS[0],
          tag: 'Programming',
          date: 'Yesterday',
        },
        {
          id: 'task-2',
          title: 'Logo revision',
          description: '',
          dueDate: '',
          assignee: USERS[0],
          tag: 'Design',
          date: 'Tomorrow',
        },
      ],
    },
    {
      id: 'review-1',
      title: 'Review',
      tasks: [
        {
          id: 'task-3',
          title: 'Empty task',
          description: '',
          dueDate: '',
          assignee: null,
          tag: null,
          date: null,
        },
        {
          id: 'task-4',
          title: 'UI-Kit',
          description: '',
          dueDate: '',
          assignee: USERS[1],
          tag: 'Design',
          date: 'Tomorrow',
          flag: 'yellow',
        },
        {
          id: 'task-5',
          title: 'Managing',
          description: '',
          dueDate: '',
          assignee: null,
          tag: null,
          date: null,
        },
        {
          id: 'task-6',
          title: 'Fixing bugs',
          description: '',
          dueDate: '',
          assignee: USERS[2],
          tag: 'Design',
          date: 'Today',
          flag: 'yellow',
        },
        {
          id: 'task-7',
          title: 'Design Concept 2',
          description: '',
          dueDate: '',
          assignee: USERS[3],
          tag: 'Design',
          date: 'Today',
        },
      ],
    },
    {
      id: 'review-2',
      title: 'Review',
      tasks: [
        {
          id: 'task-8',
          title: 'Empty task',
          description: '',
          dueDate: '',
          assignee: null,
          tag: null,
          date: null,
        },
        {
          id: 'task-9',
          title: 'Right text for modal',
          description: '',
          dueDate: '',
          assignee: USERS[0],
          tag: 'Design',
          date: 'Tomorrow',
        },
        {
          id: 'task-10',
          title: 'UI-Kit',
          description: '',
          dueDate: '',
          assignee: USERS[1],
          tag: 'Design',
          date: 'Today',
        },
        {
          id: 'task-11',
          title: 'Modal design fix',
          description: '',
          dueDate: '',
          assignee: USERS[2],
          tag: 'Programming',
          date: 'Yesterday',
        },
        {
          id: 'task-12',
          title:
            'Create and finalize the design of the admin panel and mobile app',
          description: '',
          dueDate: '',
          assignee: USERS[3],
          tag: 'Programming',
          date: '12 Feb',
        },
      ],
    },
  ]);

  // State for tracking which column is adding a task
  const [addingTaskInColumn, setAddingTaskInColumn] = useState(null);

  // State for new task form
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assigneeId: '',
    tag: '',
  });

  // State for dropdown menu
  const [activeDropdown, setActiveDropdown] = useState(null);

  // State for adding a new section
  const [addingSectionName, setAddingSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  // Refs
  const newTaskInputRef = useRef(null);
  const newSectionInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when adding task
  useEffect(() => {
    if (addingTaskInColumn && newTaskInputRef.current) {
      newTaskInputRef.current.focus();
    }
  }, [addingTaskInColumn]);

  // Focus input when adding section
  useEffect(() => {
    if (isAddingSection && newSectionInputRef.current) {
      newSectionInputRef.current.focus();
    }
  }, [isAddingSection]);

  // Handle adding a new task
  const handleAddTask = (columnId) => {
    if (addingTaskInColumn === columnId) {
      // Submit the form if already adding to this column
      if (newTaskForm.title.trim()) {
        const updatedColumns = columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  id: `task-${Date.now()}`,
                  title: newTaskForm.title,
                  description: newTaskForm.description,
                  dueDate: newTaskForm.dueDate,
                  assignee: newTaskForm.assigneeId
                    ? USERS.find(
                        (user) =>
                          user.id === Number.parseInt(newTaskForm.assigneeId)
                      )
                    : null,
                  tag: newTaskForm.tag,
                  date: newTaskForm.dueDate
                    ? new Date(newTaskForm.dueDate).toLocaleDateString()
                    : null,
                },
              ],
            };
          }
          return column;
        });

        setColumns(updatedColumns);
        setNewTaskForm({
          title: '',
          description: '',
          dueDate: '',
          assigneeId: '',
          tag: '',
        });
        setAddingTaskInColumn(null);
      }
    } else {
      // Start adding to this column
      setAddingTaskInColumn(columnId);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cancel adding task
  const handleCancelAddTask = () => {
    setAddingTaskInColumn(null);
    setNewTaskForm({
      title: '',
      description: '',
      dueDate: '',
      assigneeId: '',
      tag: '',
    });
  };

  // Handle adding a new section
  const handleAddSection = () => {
    if (isAddingSection) {
      if (addingSectionName.trim()) {
        setColumns([
          ...columns,
          {
            id: `section-${Date.now()}`,
            title: addingSectionName,
            tasks: [],
          },
        ]);
        setAddingSectionName('');
      }
      setIsAddingSection(false);
    } else {
      setIsAddingSection(true);
    }
  };

  // Handle delete task
  const handleDeleteTask = (columnId, taskId) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setActiveDropdown(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, columnId, taskId) => {
    e.dataTransfer.setData('columnId', columnId);
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    const sourceColumnId = e.dataTransfer.getData('columnId');
    const taskId = e.dataTransfer.getData('taskId');

    if (sourceColumnId === targetColumnId) return;

    // Find the task in the source column
    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    const task = sourceColumn.tasks.find((t) => t.id === taskId);

    // Remove from source column and add to target column
    const updatedColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== taskId),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        };
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  // Helper function to render date with appropriate color
  const renderDate = (date) => {
    if (!date) return null;

    let className = 'text-xs';
    if (date === 'Yesterday') {
      className += ' text-red-500';
    } else if (date === 'Tomorrow') {
      className += ' text-blue-500';
    } else {
      className += ' text-gray-500';
    }

    return <span className={className}>{date}</span>;
  };

  return (
    <div className='flex flex-col h-screen bg-white'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 py-3 border-b'>
        <div className='flex items-center gap-4'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 bg-black rounded-lg'>
              <svg
                className='w-5 h-5 text-white'
                viewBox='0 0 16 20'
                fill='currentColor'
              >
                <path d='M11.03 10.434c-.02-2.035 1.666-3.026 1.743-3.073-95-.141-1.84-.821-1.83-1.628-.043-1.012.37-1.99 1.121-2.651-1.098-1.61.166-4.102 2.39-5.179 1.423-.688 3.115-.363 4.107.494 1.03.818 1.8 2.142 1.592 3.388 1.246.087 2.483-.318 3.426-1.054.389.739.695 1.554.905 2.416-1.04.468-1.957 1.157-2.682 2.015.013 1.908-1.677 4.164-4.286 4.164-1.059.006-2.07-.431-2.868-1.2-1.055.257-2.16.32-3.248.185.25-1.054.76-2.006 1.48-2.763-1.2-.857-1.928-2.285-1.928-3.846 0-2.813 2.279-4.998 5.092-4.998 1.413-.012 2.774.56 3.77 1.575 1.237-.577 2.605-.876 3.992-.87 1.383.006 2.75.305 3.98.87-.998-1.012-2.358-1.584-3.77-1.575-2.813 0-5.092 2.185-5.092 4.998 0 1.56.728 2.989 1.928 3.846-.72.757-1.23 1.71-1.48 2.763 1.088.135 2.193.072 3.248-.185.798.769 1.809 1.206 2.868 1.2 2.609 0 4.299-2.256 4.286-4.164.725-.858 1.642-1.547 2.682-2.015-.21-.862-.516-1.677-.905-2.416-.943.736-2.18 1.141-3.426 1.054.208-1.246-.562-2.57-1.592-3.388-.992-.857-2.684-1.182-4.107-.494-2.224 1.077-3.488 3.569-2.39 5.179-.751.661-1.164 1.639-1.121 2.651-.01.807.735 1.487 1.83 1.628-.077.047-1.763 1.038-1.743 3.073-.02 1.046.85 1.86 1.848 1.86 1.177 0 1.698-.85 3.168-.85 1.47 0 1.99.85 3.168.85.998 0 1.868-.814 1.848-1.86z' />
              </svg>
            </div>
            <div>
              <h1 className='text-base font-semibold'>Apple</h1>
              <p className='text-xs text-gray-500'>5 boards · 24 members</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </button>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8m4-9-4 4 4 4m-4-4h8' />
            </svg>
          </button>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Board */}
      <div className='flex-1 overflow-x-auto'>
        <div className='flex h-full min-w-max p-4 gap-4'>
          {columns.map((column) => (
            <div
              key={column.id}
              className='flex flex-col w-72 min-h-full'
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className='flex items-center justify-between mb-3'>
                <h2 className='text-sm font-medium'>{column.title}</h2>
                <div className='flex items-center gap-1'>
                  <button
                    className='p-1 rounded hover:bg-gray-100'
                    onClick={() => handleAddTask(column.id)}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                  </button>
                  <button className='p-1 rounded hover:bg-gray-100'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='flex-1 bg-gray-50 rounded-lg p-2'>
                {/* Add task form */}
                {addingTaskInColumn === column.id && (
                  <div className='bg-white rounded-lg shadow-sm mb-2 p-3'>
                    <input
                      ref={newTaskInputRef}
                      type='text'
                      name='title'
                      value={newTaskForm.title}
                      onChange={handleInputChange}
                      placeholder='Task title'
                      className='w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <textarea
                      name='description'
                      value={newTaskForm.description}
                      onChange={handleInputChange}
                      placeholder='Description'
                      className='w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      rows='2'
                    ></textarea>
                    <div className='flex gap-2 mb-2'>
                      <input
                        type='date'
                        name='dueDate'
                        value={newTaskForm.dueDate}
                        onChange={handleInputChange}
                        className='flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <select
                        name='assigneeId'
                        value={newTaskForm.assigneeId}
                        onChange={handleInputChange}
                        className='flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value=''>Select assignee</option>
                        {USERS.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <select
                      name='tag'
                      value={newTaskForm.tag}
                      onChange={handleInputChange}
                      className='w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value=''>Select tag</option>
                      {TAGS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={handleCancelAddTask}
                        className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddTask(column.id)}
                        className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className='bg-white rounded-lg shadow-sm mb-2 p-3 relative cursor-move'
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                  >
                    {task.flag && (
                      <div className='absolute right-3 top-3 w-2 h-2 rounded-full bg-yellow-400' />
                    )}
                    <div className='relative'>
                      <h3 className='text-sm font-medium mb-1 pr-6'>
                        {task.title}
                      </h3>
                      <div className='absolute top-0 right-0'>
                        <button
                          className='p-1 rounded hover:bg-gray-100'
                          onClick={() =>
                            setActiveDropdown(
                              task.id === activeDropdown ? null : task.id
                            )
                          }
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                            />
                          </svg>
                        </button>

                        {/* Dropdown menu */}
                        {activeDropdown === task.id && (
                          <div
                            ref={dropdownRef}
                            className='absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border'
                          >
                            <button
                              className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                              onClick={() =>
                                handleDeleteTask(column.id, task.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className='text-xs text-gray-600 mb-2'>
                        {task.description}
                      </p>
                    )}

                    {(task.assignee || task.date || task.tag) && (
                      <div className='flex items-center justify-between mt-2'>
                        {task.assignee && (
                          <div className='flex items-center'>
                            <div className='w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden'>
                              {task.assignee.image ? (
                                <img
                                  src={
                                    task.assignee.image || '/placeholder.svg'
                                  }
                                  alt={task.assignee.name}
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <span className='text-xs font-medium'>
                                  {task.assignee.initial}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className='flex items-center gap-2'>
                          {task.date && renderDate(task.date)}
                          {task.tag && (
                            <span className='text-xs text-gray-500'>
                              {task.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add task button when no tasks or after existing tasks */}
                {column.tasks.length === 0 &&
                addingTaskInColumn !== column.id ? (
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className='w-full flex items-center justify-center text-gray-500 py-2 px-3 hover:bg-gray-100 rounded-md'
                  >
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                    Add task
                  </button>
                ) : (
                  column.tasks.length > 0 &&
                  addingTaskInColumn !== column.id && (
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className='w-full flex items-center justify-center text-gray-500 py-2 px-3 hover:bg-gray-100 rounded-md mt-2'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      Add task
                    </button>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Add section */}
          <div className='flex flex-col w-72 min-h-full'>
            {isAddingSection ? (
              <div className='bg-white rounded-lg border p-3'>
                <input
                  ref={newSectionInputRef}
                  type='text'
                  value={addingSectionName}
                  onChange={(e) => setAddingSectionName(e.target.value)}
                  placeholder='Section name'
                  className='w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => setIsAddingSection(false)}
                    className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSection}
                    className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddSection}
                className='border border-dashed rounded-lg p-3 text-gray-500 hover:bg-gray-50 flex items-center justify-center'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                Add section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;
