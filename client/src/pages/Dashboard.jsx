import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Search, FileText, Save, Share2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import API from '../api/axios';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, [search]);

    const fetchNotes = async () => {
        try {
            const { data } = await API.get(`/notes?search=${search}`);
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes', error);
        }
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleCreateNew = () => {
        setSelectedNote(null);
        setTitle('');
        setContent('');
    };

    const handleSave = async () => {
        try {
            if (selectedNote) {
                // Update existing note
                await API.put(`/notes/${selectedNote._id}`, { title, content });
            } else {
                // Create new note
                await API.post('/notes', { title, content });
            }
            fetchNotes(); // Refresh list
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Save failed', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('profile');
        navigate('/login');
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
                            <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{note.content.replace(/<[^>]*>/g, '')}</p>
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
        </div>
    );
};

export default Dashboard;