import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CheckSquare, MoreHorizontal } from 'react-feather';
import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';
import Tag from '../Tags/Tag';
import CardDetails from './CardDetails/CardDetails';

const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable key={props.id.toString()} draggableId={props.id.toString()} index={props.index}>
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="bg-gray-100 rounded-md shadow-md mx-auto px-2 pb-1 text-gray-800 mb-2 cursor-pointer"
            onClick={() => setModalShow(true)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="flex items-center justify-between">
              <p>{props.title}</p>
              <MoreHorizontal 
                className="opacity-50 hover:opacity-100 transition-opacity duration-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(true);
                }}
              />
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

            <div className="flex justify-between mt-2">
              {props.card.task.length !== 0 && (
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckSquare className="h-4 w-4" />
                  <span className="ml-1">
                    {props.card.task.length !== 0
                      ? `${props.card.task.filter((item) => item.completed).length} / ${props.card.task.length}`
                      : '0/0'}
                  </span>
                </div>
              )}
            </div>

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
