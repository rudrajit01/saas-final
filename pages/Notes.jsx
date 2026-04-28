'use client'

import { useEffect, useState } from "react";
import api from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = null;

  const fetchNotes = async () => {
    try {
      setError("");
      const res = await api.get("/notes");
      setNotes(res.data?.data || res.data?.notes || []);
    } catch (err) {
      console.error("Fetch notes error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setError("");

      if (editId) {
        await api.put(`/notes/${editId}`, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await api.post("/notes", {
          title: title.trim(),
          content: content.trim(),
        });
      }

      setTitle("");
      setContent("");
      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.error("Save note error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save note");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
    setError("");
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Delete note error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  const handleCancelEdit = () => {
    setTitle("");
    setContent("");
    setEditId(null);
    setError("");
  };

  return (
    <div className="notes-page">
      <h2>Notes</h2>

      {error && <p className="error-text">{error}</p>}

      <div className="page-grid">
        <div className="form-card">
          <h3>{editId ? "Edit Note" : "Add New Note"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows="6"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <div className="actions-row">
              <button type="submit" className="primary-btn">
                {editId ? "Update Note" : "Add Note"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="notes-card">
          <h3>Your Notes</h3>

          {loading ? (
            <p className="muted-text">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="empty-text">No notes found</p>
          ) : (
            <ul className="note-list">
              {notes.map((note) => (
                <li key={note._id} className="note-item">
                  <strong>{note.title}</strong>
                  <p>{note.content}</p>

                  <div className="actions-row">
                    <button
                      className="secondary-btn"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>

                    <button
                      className="secondary-btn delete-btn"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;