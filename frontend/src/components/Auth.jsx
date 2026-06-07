import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'user'; // Defaults to user
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(role === 'admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        const payload = { username, password };

        // Only pass is_staff flag during registration
        if (!isLogin) {
            payload.is_staff = role === 'admin';
        }

        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                if (!isLogin) {
                    setIsLogin(true);
                    alert('Registration successful! Please log in.');
                } else {
                    localStorage.setItem('token', data.access);
                    localStorage.setItem('role', role);
                    navigate(role === 'admin' ? '/admin' : '/user');
                }
            } else {

                alert('Authentication failed: ' + JSON.stringify(data));
            }
        } catch (err) {
            console.error(err);
            alert('Network error occurred.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F5F2] p-8 flex items-center justify-center font-sans relative animate-fade-in">
            {/* Soft decorative glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(232,122,93,0.04)_0%,transparent_70%)]"></div>

            <div className="relative bg-white p-10 rounded-3xl w-full max-w-md border border-[#E5E0D8] shadow-sm z-10">
                {/* Accent indicator top line */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[#E87A5D]"></div>

                <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center font-normal">
                    {isLogin ? 'Login' : 'Register'}
                </h2>


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <label className="block text-[10px] font-bold mb-2 text-gray-400 uppercase tracking-widest pl-2">
                            Username
                        </label>
                        <div className={`relative flex items-center bg-white border rounded-full px-4 py-1.5 transition-all duration-200 ${focusedField === 'username' ? 'border-gray-900 ring-2 ring-gray-900/5' : 'border-[#E5E0D8] hover:border-gray-300'}`}>
                            {/* User Icon */}
                            <svg className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input
                                type="text"
                                className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-gray-800 placeholder-gray-300 py-2"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onFocus={() => setFocusedField('username')}
                                onBlur={() => setFocusedField(null)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-[10px] font-bold mb-2 text-gray-400 uppercase tracking-widest pl-2">
                            Password
                        </label>
                        <div className={`relative flex items-center bg-white border rounded-full px-4 py-1.5 transition-all duration-200 ${focusedField === 'password' ? 'border-gray-900 ring-2 ring-gray-900/5' : 'border-[#E5E0D8] hover:border-gray-300'}`}>
                            {/* Lock Icon */}
                            <svg className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="password"
                                className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-gray-800 placeholder-gray-300 py-2"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button (Solid Black Pill) */}
                    <button
                        type="submit"
                        className="w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-full text-sm font-semibold tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {role !== 'admin' && (
                    <p 
                        className="mt-6 text-xs text-center font-bold text-gray-400 cursor-pointer hover:text-gray-900 transition-colors uppercase tracking-widest"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
                    </p>
                )}
            </div>

            {/* Back button (White Pill with Border) */}
            <button
                type="button"
                onClick={() => navigate('/')}
                className="fixed bottom-8 left-8 bg-white text-gray-900 border border-[#E5E0D8] hover:bg-slate-50 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>
        </div>
    );
}