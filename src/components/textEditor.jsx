import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

const TextEditor = ({ content, onContentChange }) => {
  const [editorContent, setEditorContent] = useState(content || '');

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleEditorChange = (content) => {
    setEditorContent(content);
    onContentChange(content);
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
      ]
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background'
  ];

  return (
    <div className="text-editor-container">
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        placeholder="Compose something amazing..."
        style={{ height: '200px' }}
      />
    </div>
  );
};

export default TextEditor;
