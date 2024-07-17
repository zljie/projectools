import React, { useState, useEffect } from 'react';
import { CheckSquare, CreditCard, Tag, Trash, X, Calendar } from 'react-feather';
import Editable from '../../Editable/Editable';
import Modal from '../../Modal/Modal';
import { v4 as uuidv4 } from 'uuid';
import Label from '../../Label/Label';

const CardDetails = (props) => {
  const colors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0'];
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const [date, setDate] = useState(values.date || '');

  const Input = () => (
    <div>
      <input
        autoFocus
        defaultValue={text}
        type="text"
        onChange={(e) => setText(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
  );

  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter((item) => item.completed).length;
    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });
    setValues({ ...values });
  };

  const handleClickListener = (e) => {
    if (e.code === 'Enter') {
      setInput(false);
      updateTitle(text === '' ? values.title : text);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setValues({ ...values, date: e.target.value });
  };

  useEffect(() => {
    document.addEventListener('keypress', handleClickListener);
    return () => {
      document.removeEventListener('keypress', handleClickListener);
    };
  }, [text]);

  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="p-6">
        <div className="container mx-auto" style={{ minWidth: '650px', position: 'relative' }}>
          <div className="pb-4">
            <div className="flex items-center pt-3 gap-2">
              <CreditCard className="w-6 h-6 text-gray-600" />
              {input ? (
                <Input title={values.title} />
              ) : (
                <h5 className="cursor-pointer" onClick={() => setInput(true)}>
                  {values.title}
                </h5>
              )}
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 ml-4"
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-2/3">
              <h6 className="text-sm font-medium text-gray-700">Label</h6>
              <div className="flex flex-wrap gap-2 mt-2">
                {values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="flex justify-between items-center gap-2 px-2 py-1 rounded text-white"
                      style={{ backgroundColor: item.color }}
                      key={item.id}
                    >
                      {item.tagName.length > 10 ? `${item.tagName.slice(0, 6)}...` : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">
                    <i>No Labels</i>
                  </span>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-gray-600" />
                    <h6 className="text-sm font-medium text-gray-700">Check List</h6>
                  </div>
                  <button
                    onClick={deleteAllTask}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    Delete all tasks
                  </button>
                </div>
                <div className="mt-2 mb-2 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${calculatePercent()}%` }}
                  ></div>
                </div>
                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item) => (
                      <div className="flex items-center gap-2 mb-2" key={item.id}>
                        <input
                          className="form-checkbox h-5 w-5 text-indigo-600"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => updateTask(item.id)}
                        />
                        <h6 className={`flex-grow ${item.completed ? 'line-through' : ''}`}>
                          {item.task}
                        </h6>
                        <Trash
                          onClick={() => removeTask(item.id)}
                          className="w-4 h-4 text-gray-600 cursor-pointer"
                        />
                      </div>
                    ))
                  ) : null}
                  <Editable
                    parentClass="task__editable"
                    name="Add Task"
                    btnName="Add task"
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            <div className="w-1/3 pl-4">
              <h6 className="text-sm font-medium text-gray-700">Add to card</h6>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setLabelShow(true)}
                  className="flex items-center gap-2 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  <Tag className="w-4 h-4" />
                  Add Label
                </button>
                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                <button
                  onClick={() => props.removeCard(props.bid, values.id)}
                  className="flex items-center gap-2 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  <Trash className="w-4 h-4" />
                  Delete Card
                </button>
              </div>
              {date && (
                <div className="mt-4">
                  <h6 className="text-sm font-medium text-gray-700">Due Date</h6>
                  <p>{date}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardDetails;
