import React from 'react';

interface ResizeHandleProps {
  onResize: (newWidth: number) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const handleDrag = (e: React.DragEvent) => {
    const containerWidth = window.innerWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    onResize(Math.max(10, Math.min(50, newWidth)));
  };

  return (
    <div
      className="w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors"
      draggable="true"
      onDrag={handleDrag}
    />
  );
};