'use client'; // 确保在文件顶部

import { useState, useEffect } from 'react';
import React from 'react'; // 导入 React 以使用 React.Fragment
import dayjs from 'dayjs'; // 用于日期处理
import isoWeek from 'dayjs/plugin/isoWeek'; // 插件用于处理ISO周
import Kanban from '../components/Kanban';
import CustomCalendar from '../components/Calendar'; // 导入 CustomCalendar 组件
import Layout from '../components/Layout'; // 导入 Layout 组件
import AddNewEvent from '../components/AddNewEvent'; // 导入 AddNewEvent 组件

dayjs.extend(isoWeek);

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [projectName, setProjectName] = useState(''); // 项目名称状态
  const [startDate, setStartDate] = useState(dayjs('2024-07-03')); // 项目开始日期状态
  const [endDate, setEndDate] = useState(dayjs('2024-09-10')); // 项目结束日期状态，调整为 10 周后
  const [tasks, setTasks] = useState([]); // 任务状态

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

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <Layout>
      {/* Project Info */}
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

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">Import</button>
        <button className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">Export</button>
        <button onClick={toggleTheme} className="px-4 py-2 border border-black text-black dark:text-white dark:border-white">
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </div>

      {/* Calendar */}
      <div className="w-1/4 h-400">
        <CustomCalendar startDate={startDate} endDate={endDate} tasks={tasks} />
      </div>

      {/* TBD List */}
      <div className="w-1/4 h-400">
        <div className="border border-black text-black dark:text-white dark:border-white p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">TBD List</h3>
          {/* TBD List 内容 */}
        </div>
      </div>

      {/* Milestone List */}
      <div className="w-1/4 h-400 relative">
        <div className="absolute top-0 right-0">
          <AddNewEvent tasks={tasks} setTasks={setTasks} />
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

      {/* Message Board */}
      <div className="w-1/4 h-400">
        <div className="border border-black text-black dark:text-white dark:border-white p-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Message Board</h3>
          <textarea
            className="w-full h-64 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:border-white"
            placeholder="Leave your message here..."
          ></textarea>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1">
        <Kanban />
      </div>
    </Layout>
  );
}
