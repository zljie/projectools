import React, { useRef, useState } from "react";
import { Check, X } from "react-feather";

const Label = (props) => {
  const input = useRef();
  const [selectedColor, setSelectedColor] = useState("");
  const [label, setLabel] = useState("");

  const isColorUsed = (color) => {
    const isFound = props.tags.find((item) => item.color === color);
    return isFound ? true : false;
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-[400px] max-w-[45%] flex justify-center bg-white items-center z-30 p-2 rounded-lg shadow-lg">
      <div className="w-full max-h-[95vh] relative">
        <div className="border-b border-gray-300 h-6 flex justify-between items-center mb-2">
          <p className="text-center text-sm font-bold">Label</p>
          <X
            onClick={() => props.onClose(false)}
            className="cursor-pointer w-4 h-4"
          />
        </div>
        <div>
          <p className="text-gray-600 text-xs font-bold leading-4 my-1">Name</p>
          <div className="w-full mb-3">
            <input
              type="text"
              ref={input}
              defaultValue={label}
              placeholder="Name of label"
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-md shadow-inner p-2.5 focus:outline-none"
            />
          </div>
          <p className="text-gray-600 text-xs font-bold leading-4 my-2">
            Select color
          </p>
          <div className="flex justify-between flex-wrap mb-2">
            {props.color.map((item, index) => (
              <span
                onClick={() => setSelectedColor(item)}
                key={index}
                className={`${isColorUsed(item) ? "pointer-events-none opacity-40" : ""} h-8 min-w-[52px] px-3 flex items-center justify-center rounded-md font-semibold text-white cursor-pointer`}
                style={{ backgroundColor: item }}
              >
                {selectedColor === item ? <Check className="w-5 h-5" /> : ""}
              </span>
            ))}
          </div>
          <div className="right-4 bottom-4">
            <button
              className="bg-blue-600 h-12 w-32 text-white text-lg rounded-md hover:bg-blue-700 cursor-pointer"
              onClick={() => {
                if (label !== "") {
                  if (selectedColor === "") {
                    alert("Please select color for label.");
                  }
                  props.addTag(label, selectedColor);
                  setSelectedColor("");
                  setLabel("");
                  input.current.value = "";
                } else return;
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Label.displayName = 'Label';

export default Label;
