import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Search, FileText, Save, Share2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Quill styles
import API from '../api/axios';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareEmail, setShareEmail] = useState('');

    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            const { data } = await API.get(`/notes?search=${search}`);
            setNotes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notes', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setTitle(note.title || '');
        setContent(note.content || '');
    };

    const handleCreateNew = () => {
        setSelectedNote(null);
        setTitle('');
        setContent('');
    };

    const handleSave = async () => {
        try {
            if (!title.trim() || !content.trim()) {
                alert('Please provide both a title and content for your note.');
                return;
            }

            if (selectedNote) {
                // Update existing note
                await API.put(`/notes/${selectedNote._id}`, { title, content });
                alert('Note updated successfully!');
            } else {
                // Create new note
                const { data } = await API.post('/notes', { title, content });
                setSelectedNote(data); // Bind the new note so future saves UPDATE it, not create duplicates
                alert('New note created successfully!');
            }
            fetchNotes(); // Refresh list
        } catch (error) {
            console.error('Save failed', error);
            alert(error.response?.data?.message || 'Failed to save the note. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('profile');
        navigate('/login');
    };

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/notes/${selectedNote._id}/share`, { email: shareEmail });
            alert('Note shared successfully!');
            setShareEmail('');
            setShowShareModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to share note');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h1 className="font-bold text-xl text-blue-600">NoteFlow</h1>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="mx-4 mb-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> New Note
                </button>

                <div className="flex-1 overflow-y-auto">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => handleSelectNote(note)}
                            className={`p-4 border-b cursor-pointer transition ${selectedNote?._id === note._id ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                        >
                            <h3 className="font-semibold text-gray-800 truncate">{note.title || 'Untitled'}</h3>
                            <p className="text-sm text-gray-500 truncate">{(note.content || '').replace(/<[^>]*>/g, '')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Note Title"
                        className="text-2xl font-bold focus:outline-none w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="flex gap-2">
                        {selectedNote && (
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                <Share2 size={18} /> Share
                            </button>
                        )}
                        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <Save size={18} /> Save
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="h-full pb-12"
                    />
                </div>
            </div>

            {/* Share Modal Popup */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Share Note</h2>
                        <p className="text-gray-600 mb-4 text-sm">Enter the email of the person you want to collaborate with.</p>
                        <form onSubmit={handleShare}>
                            <input
                                type="email"
                                required
                                placeholder="user@example.com"
                                className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(false)}
                                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Share
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;