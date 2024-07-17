import React from "react";

const Modal = (props) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
      onClick={() => props.onClose(false)}
    >
      <div
        className="max-h-[95vh] max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
