// components/Kanban.js

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialColumns = {
  backlog: {
    name: 'Backlog',
    items: []
  },
  todo: {
    name: 'Todo',
    items: []
  },
  inProgress: {
    name: 'In Progress',
    items: []
  },
  review: {
    name: 'Review',
    items: []
  },
  done: {
    name: 'Done',
    items: []
  }
};

const Kanban = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  return (
    <div className="flex space-x-4">
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div key={columnId} className="flex flex-col w-1/5">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{column.name}</h2>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-4 border border-black dark:border-white rounded-md shadow-sm bg-white dark:bg-gray-700 ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-2 border border-black dark:border-white rounded-md shadow-sm bg-white dark:bg-gray-700 ${snapshot.isDragging ? 'bg-blue-100' : ''}`}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
