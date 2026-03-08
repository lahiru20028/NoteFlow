import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Search, FileText, Save, Share2, Trash, User, Moon, Sun, ChevronDown, X } from 'lucide-react';
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
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const userMenuRef = useRef(null);

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
        // Load user profile from localStorage
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }

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

    const handleDelete = async () => {
        if (!selectedNote) return;

        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await API.delete(`/notes/${selectedNote._id}`);
                alert('Note deleted successfully!');

                // Refresh list and clear selection
                fetchNotes();
                setSelectedNote(null);
                setTitle('');
                setContent('');
            } catch (error) {
                console.error('Delete failed', error);
                alert(error.response?.data?.message || 'Failed to delete note');
            }
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

    // Handle Dark Mode toggle and persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Handle closing the user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        const html = document.documentElement;

        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
            {/* Sidebar */}
            <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-colors duration-200">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 relative transition-colors duration-200">
                    <div className="flex justify-between items-center mb-0">
                        <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <FileText size={24} /> NoteFlow
                        </h1>

                        {/* User Profile Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full">
                                    <User size={18} />
                                </div>
                                <ChevronDown size={14} className={`text-gray-500 dark:text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {userProfile?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                            {userProfile?.email || 'user@example.com'}
                                        </p>
                                    </div>

                                    {/* Menu Actions */}
                                    <div className="py-1">
                                        <button
                                            onClick={toggleDarkMode}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {isDarkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-gray-500 dark:text-gray-400" />}
                                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="mx-4 mb-4 flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                    <Plus size={20} /> New Note
                </button>

                <div className="flex-1 overflow-y-auto">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => handleSelectNote(note)}
                            className={`p-4 border-b dark:border-gray-700 cursor-pointer transition ${selectedNote?._id === note._id ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-blue-50 dark:hover:bg-gray-700/50'}`}
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{note.title || 'Untitled'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{stripHtml(note.content)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900 transition-colors duration-200">
                    <input
                        type="text"
                        placeholder="Note Title"
                        className="text-2xl font-bold focus:outline-none w-full bg-transparent text-gray-900 dark:text-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="flex gap-2">
                        {selectedNote && (
                            <>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    <Share2 size={18} /> Share
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                >
                                    <Trash size={18} /> Delete
                                </button>
                            </>
                        )}
                        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <Save size={18} /> Save
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 dark-quill-wrapper">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className={`h-full pb-12 ${isDarkMode ? 'dark-mode-quill' : ''}`}
                    />
                </div>
            </div>

            {/* Share Modal Popup */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 transform transition-all">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share Note</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Enter the email of the person you want to collaborate with.</p>
                        <form onSubmit={handleShare}>
                            <input
                                type="email"
                                required
                                placeholder="user@example.com"
                                className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(false)}
                                    className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
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