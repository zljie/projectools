import React from "react";

const Tag = (props) => {
  return (
    <span
      className="bg-blue-200 w-fit px-2 rounded-md mt-auto text-sm h-5 font-semibold text-white"
      style={{ backgroundColor: `${props?.color}` }}
    >
      {props?.tagName}
    </span>
  );
};

export default Tag;
