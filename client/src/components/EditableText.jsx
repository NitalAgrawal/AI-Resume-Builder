import React, { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const EditableText = ({ 
  value, 
  onChange, 
  placeholder = "Click to edit...", 
  className = "", 
  multiline = false,
  isEditable = true 
}) => {
  const elementRef = useRef(null);

  // Sync state to DOM only if it's different from what's there
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value || "";
    }
  }, [value]);

  const handleInput = (e) => {
    const newValue = e.target.innerText;
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      elementRef.current.blur();
    }
  };

  if (!isEditable) {
    return <span className={className}>{value || placeholder}</span>;
  }

  return (
    <span
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      tabIndex={-1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        "outline-none transition-all duration-200 cursor-text min-w-[20px] inline-block",
        "hover:bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-[#6ED6B3]/40 rounded px-0.5",
        !value && "text-slate-300",
        className
      )}
      data-placeholder={placeholder}
    />
  );
};

export default EditableText;
