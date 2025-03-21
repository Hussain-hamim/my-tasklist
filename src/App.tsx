'use client';

import { useState, useRef, useEffect } from 'react';
import './styles.css'; // For Tailwind CSS
import {
  ChevronLeft,
  LogIn,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
} from 'lucide-react';

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
            <ChevronLeft size={24} color='black' />
          </button>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 bg-black rounded-lg'>
              <span style={{ color: 'white' }}>Z</span>
            </div>
            <div>
              <h1 className='text-base font-semibold'>Zareen</h1>
              <p className='text-xs text-gray-500'>5 boards · 24 members</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <Search size={20} />
          </button>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            {/*  login */}
            <LogIn size={24} />
          </button>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <Settings />
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
                    <Plus size={16} />
                  </button>
                  <button className='p-1 rounded hover:bg-gray-100'>
                    <MoreHorizontal size={16} />
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
                          <MoreHorizontal size={16} />
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
                    <Plus className='w-4 h-4 mr-2' size={16} />
                    Add task
                  </button>
                ) : (
                  column.tasks.length > 0 &&
                  addingTaskInColumn !== column.id && (
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className='w-full flex items-center justify-center text-gray-500 py-2 px-3 hover:bg-gray-100 rounded-md mt-2'
                    >
                      <Plus className='w-4 h-4 mr-2' size={16} />
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
                <Plus className='w-4 h-4 mr-2' size={16} />
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
