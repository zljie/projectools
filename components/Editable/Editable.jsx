import React, { useState } from 'react';
import { Plus, X } from 'react-feather';

const Editable = (props) => {
  const [show, setShow] = useState(props?.handler || false);
  const [text, setText] = useState(props.defaultValue || '');

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (text && props.onSubmit) {
      setText('');
      props.onSubmit(text);
    }
    setShow(false);
  };

  return (
    <div className={`h-auto ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit}>
          <div className={`flex flex-col px-2 gap-2.5 ${props.class}`}>
            <textarea
              placeholder={props.placeholder}
              autoFocus
              id="edit-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-md shadow-inner mb-3 p-2.5 transition-all focus:outline-none"
            />
            <div className="flex gap-1.5 items-center px-0.5">
              <button
                type="submit"
                className="bg-blue-600 h-8 text-white text-sm rounded-md mb-1 hover:bg-blue-700"
              >
                {props.btnName || 'Add'}
              </button>
              <X
                className="hover:cursor-pointer"
                onClick={() => {
                  setShow(false);
                  props?.setHandler(false);
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <p
          onClick={() => setShow(true)}
          className="w-11/12 flex gap-1.5 rounded-md p-2 transition-all mx-auto hover:bg-gray-300 hover:text-black hover:cursor-pointer"
        >
          {props.defaultValue === undefined ? <Plus /> : null}
          {props?.name || 'Add'}
        </p>
      )}
    </div>
  );
};

export default Editable;
