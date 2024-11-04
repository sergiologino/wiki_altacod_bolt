import React, { useState } from 'react';
import Editor from './components/Editor';
import PageTree from './components/PageTree';
import { useWikiStore } from './store';

function App() {
  const [selectedPageId, setSelectedPageId] = useState('root');
  const { pages } = useWikiStore();
  const currentPage = pages.find(p => p.id === selectedPageId);

  return (
    <div className="h-screen flex">
      <div className="w-1/5 min-w-[250px] border-r border-gray-200 overflow-hidden flex flex-col">
        <PageTree
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
        />
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={currentPage?.title || ''}
            onChange={(e) => {
              const store = useWikiStore.getState();
              store.updatePage(selectedPageId, { title: e.target.value });
            }}
            className="text-2xl font-bold w-full border-none focus:outline-none"
            placeholder="Page Title"
          />
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <Editor pageId={selectedPageId} />
        </div>
      </div>
    </div>
  );
}

export default App;