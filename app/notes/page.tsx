"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes");
      setNotes(res.data?.notes || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post("/notes", { content: newNote });
      setNotes([...notes, res.data]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to add note:", err);
      setError(err.response?.data?.message || "Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="notes-page">
      <h2>My Notes</h2>
      
      <div className="add-note">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes yet. Add your first note!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <p>{note.content}</p>
              <button onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
