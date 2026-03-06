import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // ඔබේ Backend URL එක
});

// සෑම request එකකටම Token එක ස්වයංක්‍රීයව එක් කිරීමට
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const { token } = JSON.parse(profile);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;