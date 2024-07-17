import React from "react";

export default function Navbar(props) {
  return (
    <div className="px-8 border-b border-gray-300 max-h-12 flex items-center justify-between text-gray-800">
      <h2>Kanban Board</h2>
      <div>
        {/* 这里可以添加其他内容 */}
      </div>
      {/* <button>Switch theme</button> */}
    </div>
  );
}
