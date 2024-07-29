'use client'; // 确保在文件顶部

// src/components/HomeContent.js
import { useState, useEffect } from 'react';
import React from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Kanban from '../components/Kanban';
import CustomCalendar from '../components/Calendar';
import Layout from '../components/Layout';

import { ProjectProvider, useProject } from '../dao/ProjectContext'; 

dayjs.extend(isoWeek);

const HomeContent = () => {
  const { state, dispatch } = useProject();
  const { project, milestone } = state;

  const [theme, setTheme] = useState('light');
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

  // 计算相对日期并格式化里程碑数据
  const calculateDueDate = (milestone, allMilestones) => {
    if (milestone.Type === 'relative') {
      const relativeTask = allMilestones.find(ms => ms.MilestoneId === milestone.RelativeTaskId);
      if (relativeTask) {
        return dayjs(relativeTask.dueDate).add(milestone.RelativeDate, 'day').format('YYYY-MM-DD');
      }
    }
    return milestone.DueDate ? dayjs(milestone.DueDate).format('YYYY-MM-DD') : null;
  };

  useEffect(() => {
    const formattedMilestones = milestone.map(ms => ({
      ...ms,
      dueDate: calculateDueDate(ms, milestone),
      name: ms.MilestoneName, // 确保所有数据有一个统一的 name 字段
      type: 'milestone'
    }));
    setTasks(formattedMilestones); // 只设置一次里程碑数据
  }, [milestone]);

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
            value={project.name || ""}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { name: e.target.value } })}
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
            value={project.startdate ? dayjs(project.startdate).format('YYYY-MM-DD') : ""}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { startdate: e.target.value } })}
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
            value={project.enddate ? dayjs(project.enddate).format('YYYY-MM-DD') : ""}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { enddate: e.target.value } })}
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
        <CustomCalendar startDate={dayjs(project.startdate)} endDate={dayjs(project.enddate)} tasks={tasks} />
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
        <div className="border border-black text-black dark:text-white dark:border-white p-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Milestones</h3>
          {tasks.filter(task => task.type === 'milestone').map((ms, index) => (
            <div key={index} className="mb-2 flex justify-between items-center">
              <div>
                <div>Milestone Name: {ms.name}</div>
                <div>Type: {ms.Type}</div>
                <div>Due Date: {ms.dueDate}</div>
                {ms.RelativeDate && <div>Relative Date: {ms.RelativeDate}</div>}
                {ms.RelativeTaskId && <div>Relative Task ID: {ms.RelativeTaskId}</div>}
                <div>Status: {ms.Status}</div>
              </div>
              <button
                onClick={() => dispatch({ type: 'DELETE_MILESTONE', payload: ms.MilestoneId })}
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
        <Kanban milestones={tasks.filter(task => task.type === 'milestone')} />
      </div>
    </Layout>
  );
};

export default function Home() {
  return (
    <ProjectProvider>
      <HomeContent />
    </ProjectProvider>
  );
}
