'use client'; // 确保在文件顶部

import { useState, useEffect } from 'react';
import React from 'react'; // 导入 React 以使用 React.Fragment
import dayjs from 'dayjs'; // 用于日期处理
import isoWeek from 'dayjs/plugin/isoWeek'; // 插件用于处理ISO周
dayjs.extend(isoWeek);

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [projectName, setProjectName] = useState(''); // 项目名称状态
  const [startDate, setStartDate] = useState(dayjs('2024-07-03')); // 项目开始日期状态
  const [endDate, setEndDate] = useState(dayjs('2024-07-09')); // 项目结束日期状态

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

  // 获取周一日期
  const getMonday = (date) => {
    return date.isoWeekday(1);
  };

  // 生成从startDate到endDate的日期，并按周分组
  const generateDates = (start, end) => {
    const dates = [];
    let currentDate = getMonday(start); // 从周一开始

    let week = [];

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      let task = null;
      // 如果当前日期是 Start Date，添加任务
      if (currentDate.isSame(start, 'day')) {
        task = 'Initiate Project';
      }
      week.push({ date: currentDate.format('YYYY/MM/DD'), task });
      if (week.length === 7) {
        dates.push(week);
        week = [];
      }
      currentDate = currentDate.add(1, 'day');
    }

    if (week.length > 0) {
      dates.push(week);
    }

    return dates;
  };

  const daysOfWeek = ['Mon', 'Tues', 'Wed', 'Thus', 'Fri', 'Sat', 'Sun'];
  const dates = generateDates(startDate, endDate);

  return (
    <div className="min-h-screen flex flex-col border border-black dark:border-white">
      <div className="flex justify-between p-4 border-b border-black dark:border-white">
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
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-black dark:border-white">Import</button>
          <button className="px-4 py-2 border border-black dark:border-white">Export</button>
          <button onClick={toggleTheme} className="px-4 py-2 border border-black dark:border-white">
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 border-r border-black dark:border-white p-4">
          <table className="table-auto w-full border border-black dark:border-white">
            <thead>
              <tr>
                {daysOfWeek.map(day => (
                  <th key={day} className="px-4 py-2 border border-black dark:border-white">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((week, index) => (
                <React.Fragment key={index}>
                  <tr>
                    {week.map(({ date }) => (
                      <td
                        key={date}
                        className={`px-4 py-2 border border-black dark:border-white ${
                          dayjs(date).isSame(startDate, 'day') ? 'bg-green-200 dark:bg-green-700' : ''
                        } ${
                          dayjs(date).isSame(endDate, 'day') ? 'bg-red-200 dark:bg-red-700' : ''
                        }`}
                      >
                        <div className="text-black dark:text-green-300">{date}</div>
                      </td>
                    ))}
                    {week.length < 7 && Array(7 - week.length).fill(null).map((_, idx) => (
                      <td key={`empty-${idx}`} className="px-4 py-2 border border-black dark:border-white"></td>
                    ))}
                  </tr>
                  <tr>
                    {week.map(({ date, task }) => (
                      <td key={`task-${date}`} className="px-4 py-2 border border-black dark:border-white">
                        {task && <div className="text-sm text-blue-500">{task}</div>}
                      </td>
                    ))}
                    {week.length < 7 && Array(7 - week.length).fill(null).map((_, idx) => (
                      <td key={`empty-task-${idx}`} className="px-4 py-2 border border-black dark:border-white"></td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 p-4">
          <div className="flex space-x-2 mb-4">
            <button className="px-4 py-2 border border-black dark:border-white">milestones</button>
            <button className="px-4 py-2 border border-black dark:border-white">Key items</button>
          </div>
          <div className="border border-black dark:border-white p-4">
            <div>Task name</div>
            <div>depent Task</div>
            <div>start Date</div>
            <div>work day</div>
          </div>
        </div>
      </div>
    </div>
  );
}
