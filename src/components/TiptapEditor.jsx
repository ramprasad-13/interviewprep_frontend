import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

// --- MenuBar Component for Toolbar ---
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-top p-2 bg-light">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`btn btn-sm me-1 ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}>
        Bold
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn btn-sm me-1 ${editor.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}>
        Italic
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`btn btn-sm me-1 ${editor.isActive('paragraph') ? 'btn-primary' : 'btn-outline-secondary'}`}>
        Paragraph
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`btn btn-sm me-1 ${editor.isActive('heading', { level: 3 }) ? 'btn-primary' : 'btn-outline-secondary'}`}>
        H3
      </button>
       <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`btn btn-sm me-1 ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}>
        List
      </button>
    </div>
  );
};

// --- Main Editor Component ---
const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'form-control', // Use Bootstrap's styling
      },
    },
  });

  return (
    <div className="border rounded">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} style={{ minHeight: '150px' }} className="p-2" />
    </div>
  );
};

export default TiptapEditor;