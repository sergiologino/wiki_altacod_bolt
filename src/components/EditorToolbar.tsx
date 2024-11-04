import React from 'react';

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'huge', label: 'Huge' }
];

const fonts = [
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' }
];

export const EditorToolbar: React.FC = () => {
  return (
    <div id="toolbar" className="flex items-center gap-2">
      <span className="ql-formats">
        <select className="ql-size" defaultValue="normal">
          {sizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
      </span>

      <span className="ql-formats">
        <select className="ql-font" defaultValue="sans-serif">
          {fonts.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </span>

      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>

      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>

      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>

      <span className="ql-formats">
        <button className="ql-link" />
      </span>
    </div>
  );
};