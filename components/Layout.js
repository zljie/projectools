// components/Layout.js

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col border border-black text-black dark:text-white dark:border-white bg-white dark:bg-gray-900">
      <header className="flex justify-between p-4 border-b border-black dark:border-white">
        <div className="flex space-x-4">
          {children[0]} {/* Project Info */}
        </div>
        <div className="flex space-x-2">
          {children[1]} {/* Actions */}
        </div>
      </header>
      <main className="flex flex-col flex-1 p-4">
        <div id="top" className="flex space-x-4 mb-4">
          {children[2]} {/* Calendar */}
          {children[3]} {/* TODO List */}
          {children[4]} {/* Milestone List */}
          {children[5]} {/* Message Board */}
        </div>
        <div id="bottom" className="flex-1">
          {children[6]} {/* Kanban */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
