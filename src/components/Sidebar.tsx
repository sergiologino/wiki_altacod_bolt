import React from 'react';
import { ChevronRight, ChevronDown, File, FolderPlus } from 'lucide-react';
import { WikiPage } from '../types';
import useWikiStore from '../store';

interface PageTreeProps {
  pages: WikiPage[];
  level: number;
}

const PageTree: React.FC<PageTreeProps> = ({ pages, level }) => {
  const { setCurrentPage, currentPage, addPage } = useWikiStore();

  const renderPage = (page: WikiPage) => {
    const isActive = currentPage?.id === page.id;
    const hasChildren = page.children.length > 0;

    return (
      <div key={page.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
            isActive ? 'bg-blue-50 text-blue-600' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => setCurrentPage(page)}
        >
          {hasChildren ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <File className="w-4 h-4 mr-1" />
          )}
          <span className="truncate">{page.title}</span>
          <button
            className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            onClick={(e) => {
              e.stopPropagation();
              addPage(page.id);
            }}
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
        {hasChildren && (
          <div className="ml-2">
            <PageTree pages={page.children} level={level + 1} />
          </div>
        )}
      </div>
    );
  };

  return <>{pages.map(renderPage)}</>;
};

const Sidebar: React.FC = () => {
  const { pages, addPage, sidebarWidth, setSidebarWidth } = useWikiStore();
  const [isResizing, setIsResizing] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setSidebarWidth(Math.min(Math.max(newWidth, 15), 40));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      <div
        className="h-full bg-white border-r border-gray-200 overflow-y-auto"
        style={{ width: `${sidebarWidth}%` }}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => addPage(null)}
          >
            New Page
          </button>
        </div>
        <div className="py-2">
          <PageTree pages={pages} level={0} />
        </div>
      </div>
      <div
        className="w-1 bg-gray-200 cursor-col-resize hover:bg-blue-400 active:bg-blue-600"
        onMouseDown={handleMouseDown}
      />
    </>
  );
};

export default Sidebar;