import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Fetch notes once when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/note");
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Open modal and reset fields
  const openModal = () => {
    setTitle("");
    setDesc("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Add new note to backend and update frontend
  const addNote = async () => {
    if (!title.trim() || !desc.trim()) return;
    try {
      closeModal();
      setLoading(true);
      // Add on backend
      const res = await axios.post("http://localhost:3000/note", {
        title,
        description: desc,
      });
      // If backend returns created note with _id, consider res.data
      // For now, we refetch notes to sync with backend
      const updatedNotes = await axios.get("http://localhost:3000/note");
      setNotes(updatedNotes.data);
    } catch (err) {
      console.error("Add note failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete note from backend and update frontend
  const deleteNote = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/note/${id}`);
      setNotes((oldNotes) => oldNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Delete note failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Framer motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const loadingPulse = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center py-8 px-4 font-sans text-gray-200">
      <div className="w-full max-w-md rounded-3xl shadow-2xl bg-[#2c2c2e] border border-[#3a3a3c] relative p-0">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#3a3a3c] bg-[#262628] rounded-t-3xl">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Notes</h1>
          <button
            onClick={openModal}
            className="bg-[#0a84ff] hover:bg-[#005fcc] active:bg-[#0044aa] text-white rounded-full px-5 py-2 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0a84ff]"
            aria-label="Add new note"
          >
            + Add Note
          </button>
        </header>

        {/* Notes / Loading */}
        <main className="p-6 space-y-4 min-h-[300px]">
          {loading ? (
            // Loading skeleton / animation
            <motion.div
              className="space-y-4"
              {...loadingPulse}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gradient-to-r from-[#3a3a3c] via-[#4a4a4c] to-[#3a3a3c] animate-pulse"
                />
              ))}
            </motion.div>
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-400 select-none">No notes yet.</p>
          ) : (
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    variants={noteVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-[#3a3a3c] rounded-2xl p-5 flex shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-1 pr-3">
                      <h2 className="font-semibold text-white mb-1 line-clamp-1">{note.title}</h2>
                      <p className="text-gray-300 text-sm whitespace-pre-line line-clamp-3">{note.description}</p>
                    </div>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-[#ff453a] hover:bg-[#5c1a17] rounded-full px-3 py-1 text-sm font-semibold select-none transition"
                      aria-label={`Delete note titled ${note.title}`}
                      title="Delete note"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#2c2c2e] rounded-3xl p-8 w-full max-w-sm mx-4 shadow-lg border border-[#3a3a3c]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-200 text-2xl font-bold select-none"
                style={{ cursor: "pointer" }}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">New Note</h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                autoFocus
                className="block w-full mb-4 rounded-xl px-4 py-3 bg-[#1c1c1e] border border-[#3a3a3c] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
              />
              <textarea
                rows={4}
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={200}
                className="block w-full rounded-xl px-4 py-3 bg-[#1c1c1e] border border-[#3a3a3c] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a84ff] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addNote();
                  }
                }}
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={addNote}
                  disabled={!title.trim() || !desc.trim()}
                  className={`rounded-full px-8 py-2 font-semibold shadow transition
                    ${
                      title.trim() && desc.trim()
                        ? "bg-[#0a84ff] hover:bg-[#005fcc] active:bg-[#0044aa] text-white cursor-pointer"
                        : "bg-[#3a3a3c] text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
