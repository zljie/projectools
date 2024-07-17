import React, { useState } from 'react';
import dayjs from 'dayjs';
import { X } from 'react-feather'; // 使用 Feather Icons 的 X 图标

const AddNewEvent = ({ tasks, setTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });

  const handleAddTask = () => {
    const { type, name, dueDate, relativeTask, relativeDays } = newTask;
    if (type === 'static') {
      if (name && dueDate) {
        setTasks([...tasks, { name, dueDate: dayjs(dueDate) }]);
        setNewTask({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });
        setShowModal(false);
      }
    } else if (type === 'relative') {
      const relativeTaskObj = tasks.find(task => task.name === relativeTask);
      if (name && relativeTaskObj && relativeDays) {
        const relativeDueDate = dayjs(relativeTaskObj.dueDate).add(relativeDays, 'day');
        setTasks([...tasks, { name, dueDate: relativeDueDate }]);
        setNewTask({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });
        setShowModal(false);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">
        Add New Event
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-lg w-1/3 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-700 dark:text-gray-300">
              <X size={24} />
            </button>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Add New Task</h3>
            <div className="mb-2">
              <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Type:
              </label>
              <select
                id="taskType"
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
              >
                <option value="static">Static</option>
                <option value="relative">Relative</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Name:
              </label>
              <input
                type="text"
                id="taskName"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
              />
            </div>
            {newTask.type === 'static' && (
              <div className="mb-2">
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date:
                </label>
                <input
                  type="date"
                  id="taskDueDate"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
                />
              </div>
            )}
            {newTask.type === 'relative' && (
              <>
                <div className="mb-2">
                  <label htmlFor="relativeTask" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Relative Task:
                  </label>
                  <select
                    id="relativeTask"
                    value={newTask.relativeTask}
                    onChange={(e) => setNewTask({ ...newTask, relativeTask: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
                  >
                    <option value="">Select Task</option>
                    {tasks.map((task, index) => (
                      <option key={index} value={task.name}>{task.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="relativeDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days After Relative Task:
                  </label>
                  <input
                    type="number"
                    id="relativeDays"
                    value={newTask.relativeDays}
                    onChange={(e) => setNewTask({ ...newTask, relativeDays: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
                  />
                </div>
              </>
            )}
            <button onClick={handleAddTask} className="mt-2 px-4 py-2 border border-black text-black dark:text-white dark:border-white">
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewEvent;
