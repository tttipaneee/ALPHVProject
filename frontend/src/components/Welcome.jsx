import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 flex flex-col animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(4px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.5s ease-out forwards;
                    }
                `}
            </style>

            {/* Top-right brand signature */}
            <header className="flex justify-end p-8">
                <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    {/* Geometric diamond logo */}
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-300 hover:rotate-180">
                        <polygon points="16,2 28,16 16,30 4,16" fill="#2222DD" opacity="0.1" />
                        <polygon points="16,2 28,16 16,18 4,16" fill="#2222DD" />
                        <polygon points="16,18 28,16 16,30 4,16" fill="#1111AA" />
                    </svg>
                    <span className="text-[#2222DD] font-medium tracking-widest text-xs uppercase">ALPHV</span>
                </div>
            </header>

            {/* Main Interactive Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
                {/* Decorative Pill Badge */}


                <h1
                    className="text-6xl font-medium text-slate-900 mb-6 tracking-tight"
                    style={{ letterSpacing: '-1.5px' }}
                >
                    ShapeStream
                </h1>

                <p className="text-slate-500 text-lg max-w-lg font-medium leading-relaxed mb-12">
                    A live collaboration canvas for deploying and tracking colored shapes across a unified digital grid.
                </p>

                {/* Refined Custom Actions Grid */}
                <div className="flex flex-row items-center justify-center gap-6 w-full mt-4">
                    {/* Admin Portal Button */}
                    <button
                        onClick={() => navigate('/auth?role=admin')}
                        className="w-full max-w-[32rem] bg-[#2222DD] hover:bg-[#1616b3] text-white py-10 text-xl rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Login as Admin
                    </button>

                    {/* User Portal Button */}
                    <button
                        onClick={() => navigate('/auth?role=user')}
                        className="w-full max-w-[32rem] bg-white text-[#2222DD] border-2 border-[#2222DD]/10 hover:border-[#2222DD] hover:bg-slate-50 py-10 text-xl rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2222DD] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Sign up as User
                    </button>
                </div>
            </main>

            {/* Grounded Footer */}
            <footer className="py-8 text-center border-t border-slate-100 bg-white/40 backdrop-blur-sm">
                <p className="text-slate-400 text-xs tracking-wide uppercase font-semibold">
                    Engineered by Tiffani Naomi for ALPHV
                </p>
            </footer>
        </div>
    );
}