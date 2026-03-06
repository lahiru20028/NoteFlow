import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Search, FileText, Share2 } from 'lucide-react';
import API from '../api/axios';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

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

                <button className="mx-4 mb-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} /> New Note
                </button>

                <div className="flex-1 overflow-y-auto">
                    {notes.map((note) => (
                        <div key={note._id} className="p-4 border-b hover:bg-blue-50 cursor-pointer transition">
                            <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{note.content.replace(/<[^>]*>/g, '')}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-blue-500">
                                <FileText size={12} />
                                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                    <FileText size={64} className="mb-4 opacity-20" />
                    <p>Select a note to view or create a new one</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;