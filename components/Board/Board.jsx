import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";

export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Enter") setShow(false);
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div className="relative flex flex-col w-[290px] break-words bg-gray-100 border border-gray-200 rounded-md h-full max-h-[82vh] text-gray-800 min-w-[300px] mr-2">
      <div className="flex items-center justify-between px-2 mb-0">
        {show ? (
          <div>
            <input
              className="font-normal h-8 rounded-md border border-gray-300 px-2"
              type="text"
              defaultValue={props.name}
              onChange={(e) => {
                props.setName(e.target.value, props.id);
              }}
            />
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                setShow(true);
              }}
              className="font-bold cursor-pointer"
            >
              {props?.name || "Name of Board"}
              <span className="text-xs rounded-full px-2 py-0.5 border border-gray-400 bg-gray-200 ml-2">
                {props.card?.length}
              </span>
            </p>
          </div>
        )}
        <div
          onClick={() => {
            setDropdown(true);
          }}
        >
          <MoreHorizontal />
          {dropdown && (
            <Dropdown
              class="shadow-lg cursor-default"
              onClose={() => {
                setDropdown(false);
              }}
            >
              <p
                className="border-b border-gray-300 cursor-pointer"
                onClick={() => props.removeBoard(props.id)}
              >
                Delete Board
              </p>
            </Dropdown>
          )}
        </div>
      </div>
      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="p-2 overflow-y-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <Card
                bid={props.id}
                id={items.id}
                index={index}
                key={items.id}
                title={items.title}
                tags={items.tags}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="flex flex-col">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div>
    </div>
  );
}
