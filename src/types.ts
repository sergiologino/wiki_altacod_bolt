export interface WikiPage {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children: WikiPage[];
}

export interface WikiStore {
  pages: WikiPage[];
  currentPage: WikiPage | null;
  sidebarWidth: number;
  addPage: (parentId: string | null) => void;
  updatePage: (id: string, title: string, content: string) => void;
  setCurrentPage: (page: WikiPage | null) => void;
  setSidebarWidth: (width: number) => void;
}