import React, { useRef, useEffect, useCallback } from 'react';

const Dropdown = (props) => {
  const dropRef = useRef();
  const { onClose, class: className, children } = props;

  const handleClick = useCallback((event) => {
    if (dropRef.current && !dropRef.current.contains(event.target) && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [handleClick]);

  return (
    <div
      ref={dropRef}
      className={`absolute right-0 top-10 bg-white rounded-md min-h-[40px] min-w-[80px] w-fit h-fit max-w-[250px] max-h-[390px] overflow-y-auto z-10 px-4 ${className ? className : ""}`}
    >
      {children}
    </div>
  );
}

export default Dropdown;
