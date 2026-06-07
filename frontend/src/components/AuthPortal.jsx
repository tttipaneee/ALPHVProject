import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AuthPortal({ token, setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [focusedField, setFocusedField] = useState(null);

    const LOGIN_URL = 'http://localhost:8000/api/login/';

    // If already logged in, redirect them immediately to the dashboard
    if (token) {
        return <Navigate to="/dashboard" />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginPromise = fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');
            return data;
        });

        toast.promise(loginPromise, {
            loading: 'Authenticating...',
            success: (data) => {
                setToken(data.access);
                localStorage.setItem('token', data.access);
                navigate('/dashboard'); // Route to dashboard upon success
                return 'Login Successful!';
            },
            error: (err) => err.message,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="bg-white px-8 py-14 rounded-xl shadow-md max-w-sm w-full">
                <h2 className="text-2xl font-semibold mb-8 text-slate-800 text-center">Admin Authentication Gate</h2>
                <div
                    className="min-h-screen p-8 flex items-center justify-center font-sans relative"
                    style={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor: '#f8fafc',
                        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                >
                    {/* Radial glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(34,34,221,0.05) 0%, transparent 70%)' }}></div>

                    <div className="relative bg-white px-10 py-12 rounded-2xl w-full max-w-sm z-10" style={{ boxShadow: '0 10px 40px -10px rgba(34,34,221,0.10), 0 4px 6px -4px rgba(34,34,221,0.05)' }}>
                        {/* 1px gradient accent bar at the top */}
                        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-[#2222DD] to-[#6677FF]"></div>

                        <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">Admin Authentication Gate</h2>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-600">Username</label>
                                <input type="text" className="w-full border rounded p-3 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }} value={username} onChange={e => setUsername(e.target.value)} required />
                                <label className="block text-xs font-semibold mb-2 text-slate-500 uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-slate-800 outline-none transition-all duration-200 ${focusedField === 'username' ? 'border-[#2222DD]' : 'border-slate-200 hover:border-slate-300'}`}
                                    style={{ boxShadow: focusedField === 'username' ? '0 0 0 4px rgba(34,34,221,0.08)' : 'none', fontFamily: "'Poppins', sans-serif" }}
                                    value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)} required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-600">Password</label>
                                <input type="password" className="w-full border rounded p-3 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }} value={password} onChange={e => setPassword(e.target.value)} required />
                                <label className="block text-xs font-semibold mb-2 text-slate-500 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-slate-800 outline-none transition-all duration-200 ${focusedField === 'password' ? 'border-[#2222DD]' : 'border-slate-200 hover:border-slate-300'}`}
                                    style={{ boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(34,34,221,0.08)' : 'none', fontFamily: "'Poppins', sans-serif" }}
                                    value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} required
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button type="submit" className="w-full bg-[#2222DD] hover:bg-[#1616b3] text-white p-4 text-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    <button type="submit" className="w-full bg-gradient-to-b from-[#2222DD] to-[#3344EE] text-white p-4 text-base rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] font-bold hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]" style={{ boxShadow: '0 8px 20px -6px rgba(34,34,221,0.4)', fontFamily: "'Poppins', sans-serif" }}>
                                        Authenticate Admin
                                    </button>
                            </div>
                        </form>
                    </div>
                    <button type="button" onClick={() => navigate('/')} className="fixed bottom-8 left-8 bg-white text-[#2222DD] border-2 border-[#2222DD]/10 hover:border-[#2222DD] hover:bg-slate-50 px-8 py-4 text-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <button type="button" onClick={() => navigate('/')} className="fixed bottom-8 left-8 z-50 bg-white text-slate-500 border-2 border-slate-200 hover:text-[#2222DD] hover:border-[#2222DD] hover:bg-slate-50 px-8 py-3 text-base rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] font-bold cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Back to Home
                        </button>
                </div>
                );
}