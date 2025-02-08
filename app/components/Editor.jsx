"use client"
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { HTMLToMarkdownExtension } from './HTMLToMarkdownExtension' // adjust the path as needed

const Editor = () => {
  const [title, setTitle] = useState('');
  const extensions = [
    StarterKit,
    HTMLToMarkdownExtension
  ];

  const editor = useEditor({
    extensions: extensions,
    content: '',
  });

  const handlePreview = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }
    const md = editor.commands.convertHTMLToMarkdown();
    console.log(md);
  };

  return (
    <div className="prose max-w-[1200px] w-full mx-auto">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold w-full mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 pl-2"
      />
      <EditorContent
        editor={editor}
        
      />
      <button onClick={handlePreview} className="mt-4 px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300">Preview</button>
    </div>
  );
};

export default Editor;
