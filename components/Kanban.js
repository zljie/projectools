// src/components/Kanban/Kanban.js
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from './Board/Board';
import Editable from './Editable/Editable';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from 'use-local-storage';
import Navbar from './Navbar/Navbar';

const Kanban = () => {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    const storedData = localStorage.getItem('kanban-board');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      // 初始化5个默认的 Board
      const initialBoards = [
        { id: uuidv4(), boardName: 'Backlog', card: [] },
        { id: uuidv4(), boardName: 'Todo', card: [] },
        { id: uuidv4(), boardName: 'In Progress', card: [] },
        { id: uuidv4(), boardName: 'Review', card: [] },
        { id: uuidv4(), boardName: 'Done', card: [] },
      ];
      setData(initialBoards);
    }
  }, []);

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

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
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
                addCard={addCard}
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
    </DragDropContext>
  );
};
Kanban.displayName = 'Kanban';

export default Kanban;
