import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, FolderPlus, Trash2, Plus } from 'lucide-react';
import { useWikiStore } from '../store';

interface PageTreeProps {
  selectedPageId: string;
  onSelectPage: (id: string) => void;
}

interface TreeNode {
  id: string;
  title: string;
  children: TreeNode[];
}

const PageTree: React.FC<PageTreeProps> = ({ selectedPageId, onSelectPage }) => {
  const { pages, addPage, deletePage, movePage } = useWikiStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const buildTree = (parentId: string | null): TreeNode[] => {
    return pages
      .filter(page => page.parentId === parentId)
      .map(page => ({
        id: page.id,
        title: page.title,
        children: buildTree(page.id)
      }));
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isSelected = node.id === selectedPageId;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="select-none">
        <div
          className={`group flex items-center p-1 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-100' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
        >
          <div
            className="flex items-center cursor-pointer"
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )
            ) : (
              <File className="w-4 h-4 mr-1" />
            )}
          </div>
          <span
            className="flex-1 truncate"
            onClick={() => onSelectPage(node.id)}
          >
            {node.title || 'Untitled'}
          </span>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => addPage('New Page', node.id)}
              title="Add subpage"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            {node.id !== 'root' && (
              <button
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => deletePage(node.id)}
                title="Delete page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(null);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => addPage('New Page', null)}
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {tree.map(node => renderNode(node))}
      </div>
    </div>
  );
};

export default PageTree;