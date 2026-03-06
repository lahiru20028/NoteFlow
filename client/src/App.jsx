import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * Higher-order component to protect private routes.
 * Redirects unauthenticated users to the login page.
 */
const ProtectedRoute = ({ children }) => {
    const profile = localStorage.getItem('profile');
    return profile ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    {/* Publicly accessible routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private route for the main application dashboard */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <div className="p-10 text-center text-2xl">
                                    Welcome to your Dashboard! (Coming Soon)
                                </div>
                            </ProtectedRoute>
                        } 
                    />

                    {/* Redirect the root path to login by default */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
    <Route 
    path="/dashboard" 
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    } 
/>
}

export default App;