// components/Calendar.js

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

const CustomCalendar = ({ startDate, endDate, tasks }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const taskForDate = tasks.find(task => dayjs(task.dueDate).isSame(dayjs(date), 'day'));
      return taskForDate ? <p className="task">{taskForDate.name}</p> : null;
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (dayjs(date).isSame(dayjs(startDate), 'day')) {
        return 'start-date';
      }
      if (dayjs(date).isSame(dayjs(endDate), 'day')) {
        return 'end-date';
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        minDate={new Date(startDate)}
        maxDate={new Date(endDate)}
        className="react-calendar"
      />
      <style jsx>{`
        .react-calendar {
          width: 100%;
          border: none;
        }
        .task {
          background-color: #ffeb3b;
          padding: 2px;
          border-radius: 4px;
          text-align: center;
          margin-top: 5px;
        }
        .start-date {
          background-color: green;
          color: white;
        }
        .end-date {
          background-color: red;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CustomCalendar;
