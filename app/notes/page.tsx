"use client";

import { useEffect, useState } from "react";

interface Note {
  _id: string;
  content: string;
  createdAt?: string;
}

// লোকাল স্টোরেজ হেল্পার
const getNotesFromStorage = (): Note[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("my_notes");
  return stored ? JSON.parse(stored) : [];
};

const saveNotesToStorage = (notes: Note[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("my_notes", JSON.stringify(notes));
  }
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  // প্রথম লোডে স্টোরেজ থেকে ডাটা আনা
  useEffect(() => {
    const storedNotes = getNotesFromStorage();
    setNotes(storedNotes);
    setLoading(false);
  }, []);

  // notes স্টেট পরিবর্তিত হলে স্টোরেজ আপডেট
  useEffect(() => {
    if (!loading) {
      saveNotesToStorage(notes);
    }
  }, [notes, loading]);

  const addNote = () => {
    if (!newNote.trim()) {
      setError("নোট খালি রাখা যাবে না");
      return;
    }
    try {
      const newId = Date.now().toString();
      const newNoteObj: Note = {
        _id: newId,
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
      };
      setNotes([newNoteObj, ...notes]);
      setNewNote("");
      setError(null);
    } catch (err) {
      setError("নোট যোগ করতে ব্যর্থ হয়েছে");
    }
  };

  const deleteNote = (id: string) => {
    try {
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      setError("নোট মুছতে ব্যর্থ হয়েছে");
    }
  };

  if (loading) {
    return <div className="loading-spinner">লোড হচ্ছে...</div>;
  }

  return (
    <div className="notes-page">
      <h2>📝 আমার নোট</h2>

      <div className="add-note">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="নতুন নোট লিখুন..."
        />
        <button onClick={addNote}>নোট যোগ করুন</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>কোনো নোট নেই। উপরে যোগ করুন!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <p>{note.content}</p>
              <button onClick={() => deleteNote(note._id)}>মুছুন</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
