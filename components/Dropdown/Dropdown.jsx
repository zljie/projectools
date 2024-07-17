import React, { useRef, useEffect } from 'react';

const Dropdown = (props) => {
  const dropRef = useRef();

  const handleClick = (event) => {
    if (dropRef.current && !dropRef.current.contains(event.target) && props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return (
    <div
      ref={dropRef}
      className={`absolute right-0 top-10 bg-white rounded-md min-h-[40px] min-w-[80px] w-fit h-fit max-w-[250px] max-h-[390px] overflow-y-auto z-10 px-4 ${props.class ? props.class : ""}`}
    >
      {props.children}
    </div>
  );
}

export default Dropdown;
