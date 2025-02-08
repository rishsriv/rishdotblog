"use client"
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { HTMLToMarkdownExtension } from './HTMLToMarkdownExtension' // adjust the path as needed

const Editor = () => {
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState("");
  const extensions = [
    StarterKit,
    HTMLToMarkdownExtension
  ];

  const editor = useEditor({
    extensions: extensions,
    content: '',
  });

  useEffect(() => {
    if (activeTab === 'preview') {
      const frontmatter = `---\ntitle: ${title}\npublished: ${new Date().toISOString()}\npublic: true\n---\n\n`;
      const md = editor.commands.convertHTMLToMarkdown();
      setPreviewContent(frontmatter + md);
    }
  }, [activeTab, title]);

  return (
    <div className="editor-container">
      <div className="flex flex-row gap-2 mb-8">
        <button
          className={"border border-gray-200 dark:border-gray-800 rounded px-4 py-2" + (activeTab === 'edit' ? ' underline' : '')}
          onClick={() => setActiveTab('edit')}
        >
          Edit
        </button>
        <button
          className={"border border-gray-200 dark:border-gray-800 rounded px-4 py-2" + (activeTab === 'preview' ? ' underline' : '')}
          onClick={() => setActiveTab('preview')}
        >
          Markdown
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div className="prose">
          <pre>
            {previewContent}
          </pre>
        </div>
      ) : (
        <div className="editor-ui">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold w-full mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 pl-2"
          />
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
};

export default Editor;
