import React from 'react';
import { PlusCircle, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface ToolbarProps {
  onAddPage: () => void;
  onDeletePage: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddPage,
  onDeletePage,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {onToggleExpand && (
        <button
          onClick={onToggleExpand}
          className="p-1 hover:bg-gray-100 rounded"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}
      <button
        onClick={onAddPage}
        className="p-1 hover:bg-gray-100 rounded"
        title="Add Page"
      >
        <PlusCircle className="w-4 h-4" />
      </button>
      <button
        onClick={onDeletePage}
        className="p-1 hover:bg-gray-100 rounded text-red-500"
        title="Delete Page"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};