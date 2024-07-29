// src/components/Kanban/Kanban.js
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from './Board/Board';
import Editable from './Editable/Editable';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from 'use-local-storage';
import Navbar from './Navbar/Navbar';
import dayjs from 'dayjs';
import { X } from 'react-feather'; // 使用 Feather Icons 的 X 图标
import { useProject } from '../dao/ProjectContext'; // 引入 useProject 钩子

const Kanban = ({ milestones }) => {
  const { state, dispatch } = useProject(); // 使用 useProject 钩子
  const [data, setData] = useState([]);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [newTask, setNewTask] = useState({ type: 'static', name: '', dueDate: '', relativeTask: '', relativeDays: 0 });

  useEffect(() => {
    if (milestones && milestones.length > 0) {
      const updatedData = [
        { id: uuidv4(), boardName: 'Backlog', card: [] },
        { id: uuidv4(), boardName: 'Todo', card: [] },
        { id: uuidv4(), boardName: 'In Progress', card: [] },
        { id: uuidv4(), boardName: 'Review', card: [] },
        { id: uuidv4(), boardName: 'Done', card: [] },
      ];

      milestones.forEach(ms => {
        const boardIndex = updatedData.findIndex(board => board.boardName === ms.Status);
        if (boardIndex !== -1) {
          updatedData[boardIndex].card.push({
            id: ms.MilestoneId,
            title: ms.MilestoneName,
            tags: ms.label,
            task: [],
            dueDate: ms.date,
            type: ms.Type,
            relativeDate: ms.RelativeDate,
            relativeTaskId: ms.RelativeTaskId
          });
        }
      });

      setData(updatedData);
    }
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(data));
  }, [data]);

  const switchTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex((item) => item.id.toString() === destination.droppableId);
    const sourceBoardIdx = tempData.findIndex((item) => item.id.toString() === source.droppableId);
    tempData[destinationBoardIdx].card.splice(destination.index, 0, tempData[sourceBoardIdx].card[source.index]);
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title, boardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    setData(tempData);
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    setData(tempBoards);
  };

  const handleAddCard = (bid) => {
    setSelectedBoardId(bid);
    setShowModal(true);
  };

  const handleAddTask = () => {
    const { type, name, dueDate, relativeTask, relativeDays } = newTask;
    if (type === 'static') {
      if (name && dueDate) {
        const task = { 
          MilestoneId: uuidv4(), 
          MilestoneName: name, 
          DueDate: dayjs(dueDate).format('YYYY-MM-DD'), 
          Type: 'static', 
          Status: selectedBoardId,
        };
        dispatch({ type: 'ADD_MILESTONE', payload: task });
        setShowModal(false);
      }
    } else if (type === 'relative') {
      const relativeTaskObj = state.milestones.find(ms => ms.MilestoneId === relativeTask);
      if (name && relativeTaskObj && relativeDays) {
        const relativeDueDate = dayjs(relativeTaskObj.dueDate).add(relativeDays, 'day').format('YYYY-MM-DD');
        const task = { 
          MilestoneId: uuidv4(), 
          MilestoneName: name, 
          DueDate: relativeDueDate, 
          Type: 'relative', 
          RelativeTaskId: relativeTask, 
          RelativeDate: relativeDays, 
          Status: selectedBoardId 
        };
        dispatch({ type: 'ADD_MILESTONE', payload: task });
        setShowModal(false);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`Kanban ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} transition-all duration-350`} data-theme={theme}>
        <Navbar switchTheme={switchTheme} />
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row gap-8 mt-5 p-8 overflow-x-auto">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                handleAddCard={handleAddCard} // 传递 handleAddCard 函数
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            <Editable
              className="add__board border border-gray-400 h-8"
              name="Add Board"
              btnName="Add Board"
              onSubmit={addBoard}
              placeholder="Enter Board Title"
            />
          </div>
        </div>
      </div>
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
                    {state.milestones.map((task, index) => (
                      <option key={index} value={task.MilestoneId}>{task.MilestoneName}</option>
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
    </DragDropContext>
  );
};
Kanban.displayName = 'Kanban';

export default Kanban;
