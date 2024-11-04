import React, { useRef, useCallback, useMemo, forwardRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useWikiStore } from '../store';
import { EditorToolbar } from './EditorToolbar';
import ImageResize from 'quill-image-resize-module-react';
import ImageUploader from './ImageUploader';
import TableInsert from './TableInsert';

// Register the image resize module
if (Quill && !Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize);
}

// Add custom styles for tables
const tableStyles = document.createElement('style');
tableStyles.innerHTML = `
  .ql-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  .ql-editor table td {
    border: 1px solid #ccc;
    padding: 8px;
    min-width: 100px;
  }
  .ql-editor .image-style-side {
    float: right;
    margin: 0 0 1em 1em;
    max-width: 50%;
  }
`;
document.head.appendChild(tableStyles);

// Custom Quill component with forwardRef to avoid findDOMNode warning
const QuillEditor = forwardRef<ReactQuill, any>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

QuillEditor.displayName = 'QuillEditor';

interface EditorProps {
  pageId: string;
}

const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pages, updatePage } = useWikiStore();
  const currentPage = pages.find(p => p.id === pageId);

  const insertImage = useCallback((url: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', url, 'user');
      editor.setSelection(range.index + 1, 0);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && quillRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          insertImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const insertTable = useCallback((rows: number, cols: number) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      const tableHTML = `
        <table>
          <tbody>
            ${Array(rows).fill(0).map(() => `
              <tr>
                ${Array(cols).fill(0).map(() => `
                  <td><p><br></p></td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      editor.clipboard.dangerouslyPasteHTML(range.index, tableHTML, 'user');
      editor.setSelection(range.index + 1, 0);
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
      handlers: {
        image: () => {}, // Handled by custom image uploader
        table: () => {} // Handled by custom table insert
      }
    },
    clipboard: {
      matchVisual: false
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image',
    'table'
  ];

  const handleChange = useCallback((content: string) => {
    if (pageId && content !== currentPage?.content) {
      updatePage(pageId, { content });
    }
  }, [pageId, currentPage?.content, updatePage]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 border-b">
        <EditorToolbar />
        <ImageUploader ref={fileInputRef} onImageInsert={insertImage} />
        <TableInsert onTableInsert={insertTable} />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <div className="flex-1">
        <QuillEditor
          ref={quillRef}
          theme="snow"
          value={currentPage?.content || ''}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default Editor;