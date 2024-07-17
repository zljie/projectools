'use client'; // 确保在文件顶部

import { useState, useEffect } from 'react';
import React from 'react'; // 导入 React 以使用 React.Fragment
import dayjs from 'dayjs'; // 用于日期处理
import isoWeek from 'dayjs/plugin/isoWeek'; // 插件用于处理ISO周
import Kanban from '../components/Kanban';
import CustomCalendar from '../components/Calendar'; // 导入 CustomCalendar 组件

dayjs.extend(isoWeek);

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [projectName, setProjectName] = useState(''); // 项目名称状态
  const [startDate, setStartDate] = useState(dayjs('2024-07-03')); // 项目开始日期状态
  const [endDate, setEndDate] = useState(dayjs('2024-09-10')); // 项目结束日期状态，调整为 10 周后
  const [tasks, setTasks] = useState([]); // 任务状态
  const [newTask, setNewTask] = useState({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 }); // 新任务表单状态

  // 切换主题
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAddTask = () => {
    const { type, name, dueDate, relativeTask, relativeDays } = newTask;
    if (type === 'static') {
      if (name && dueDate) {
        setTasks([...tasks, { name, dueDate: dayjs(dueDate) }]);
        setNewTask({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });
      }
    } else if (type === 'relative') {
      const relativeTaskObj = tasks.find(task => task.name === relativeTask);
      if (name && relativeTaskObj && relativeDays) {
        const relativeDueDate = dayjs(relativeTaskObj.dueDate).add(relativeDays, 'day');
        setTasks([...tasks, { name, dueDate: relativeDueDate }]);
        setNewTask({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });
      }
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className={`min-h-screen flex flex-col border border-black text-black dark:text-white dark:border-white ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="flex justify-between p-4 border-b border-black text-black dark:text-white dark:border-white">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate.format('YYYY-MM-DD')}
              onChange={(e) => setStartDate(dayjs(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate.format('YYYY-MM-DD')}
              onChange={(e) => setEndDate(dayjs(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">Import</button>
          <button className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">Export</button>
          <button onClick={toggleTheme} className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
      </div>
      <div className="flex flex-1">
        <CustomCalendar startDate={startDate} endDate={endDate} tasks={tasks} />
        <div className="kanban-container mt-4">
          <Kanban />
        </div>
        <div className="w-2/5 p-4">
          <div className="border border-black text-black dark:text-white dark:border-white p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Add New Task</h3>
            <div className="mb-2">
              <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Type:
              </label>
              <select
                id="taskType"
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
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
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
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
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
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
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
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
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
                  />
                </div>
              </>
            )}
            <button onClick={handleAddTask} className="mt-2 px-4 py-2 border border-black text-black dark:text-white dark:border-white">
              Add Task
            </button>
          </div>
          <div className="border border-black text-black dark:text-white dark:border-white p-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Milestones</h3>
            {tasks.map((task, index) => (
              <div key={index} className="mb-2 flex justify-between items-center">
                <div>
                  <div>Task: {task.name}</div>
                  <div>Due Date: {dayjs(task.dueDate).format('YYYY-MM-DD')}</div>
                </div>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="px-2 py-1 border border-black text-black dark:text-white dark:border-white text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
