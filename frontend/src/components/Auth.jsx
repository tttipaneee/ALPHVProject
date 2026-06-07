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

            <div className="relative bg-white p-10 rounded-2xl w-full max-w-sm z-10" style={{ boxShadow: '0 10px 40px -10px rgba(34,34,221,0.10), 0 4px 6px -4px rgba(34,34,221,0.05)' }}>
                {/* 1px gradient accent bar at the top */}
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-[#2222DD] to-[#6677FF]"></div>

                <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">
                    {isLogin ? 'Login' : 'Register'} <span className="text-slate-400 text-lg">({role.toUpperCase()})</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-slate-500 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-slate-800 outline-none transition-all duration-200 ${focusedField === 'username' ? 'border-[#2222DD]' : 'border-slate-200 hover:border-slate-300'}`}
                            style={{ boxShadow: focusedField === 'username' ? '0 0 0 4px rgba(34,34,221,0.08)' : 'none', fontFamily: "'Poppins', sans-serif" }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-slate-500 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-slate-800 outline-none transition-all duration-200 ${focusedField === 'password' ? 'border-[#2222DD]' : 'border-slate-200 hover:border-slate-300'}`}
                            style={{ boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(34,34,221,0.08)' : 'none', fontFamily: "'Poppins', sans-serif" }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-b from-[#2222DD] to-[#3344EE] text-white p-4 text-base rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] hover:-translate-y-1 active:scale-[0.99] hover:shadow-xl"
                        style={{ boxShadow: '0 8px 20px -6px rgba(34,34,221,0.4)', fontFamily: "'Poppins', sans-serif" }}
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {role !== 'admin' && (
                    <p className="mt-6 text-sm text-center font-medium text-slate-500 cursor-pointer hover:text-[#2222DD] transition-colors" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => navigate('/')}
                className="fixed bottom-8 left-8 z-50 bg-white text-slate-500 border-2 border-slate-200 hover:text-[#2222DD] hover:border-[#2222DD] hover:bg-slate-50 px-8 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] font-bold text-base cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                Back to Home
            </button>
        </div>
    );
}