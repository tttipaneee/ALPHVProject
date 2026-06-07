import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F6F5F2] flex flex-col justify-between animate-fade-in font-sans">
            
            {/* Top Brand Signature & Navigation */}
            <header className="flex justify-end px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#E5E0D8] transition-all hover:shadow-md">
                    {/* ALPHV Custom Chevron/Crescent Double-Arch Blue Logo */}
                    <svg width="24" height="18" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-500 hover:scale-110">
                        <path d="M 35 5 L 10 25 L 35 45 Q 17 25 35 5 Z" fill="#0000ff" />
                        <path d="M 50 5 Q 68 25 50 45 Q 32 25 50 5 Z" fill="#0000ff" />
                    </svg>

                    <span className="text-gray-900 font-bold tracking-widest text-xs uppercase font-sans">ALPHV</span>
                </div>
            </header>


            {/* Interactive Hero Canvas Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto py-12">
                {/* Decorative Accent Pill Badge */}
                <div className="inline-flex items-center bg-[#EFEBE4] px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-700 tracking-widest uppercase mb-8 shadow-2xs">
                    <span className="w-2 h-2 bg-[#E87A5D] rounded-full inline-block mr-2 animate-pulse"></span>
                    Live Canvas Grid
                </div>

                <h1 className="text-6xl md:text-7xl font-serif text-gray-900 mb-6 tracking-tight font-normal leading-tight">
                    ShapeStream
                </h1>

                <p className="text-gray-500 text-base md:text-lg max-w-lg font-medium leading-relaxed mb-12 font-sans">
                    A live collaboration canvas for deploying, updating, and tracking colored shapes across a unified digital matrix.
                </p>

                {/* Redesigned Pill-shaped Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-lg">
                    {/* Admin Portal Button (Solid Black) */}
                    <button
                        onClick={() => navigate('/auth?role=admin')}
                        className="w-full bg-gray-900 hover:bg-black text-white py-4 px-8 rounded-full text-sm font-semibold tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                        Login as Admin
                    </button>

                    {/* User Portal Button (Solid White with Border) */}
                    <button
                        onClick={() => navigate('/auth?role=user')}
                        className="w-full bg-white text-gray-900 border border-[#E5E0D8] hover:bg-slate-50 py-4 px-8 rounded-full text-sm font-semibold tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                        Sign up as User
                    </button>
                </div>
            </main>

            {/* Grounded Footer */}
            <footer className="py-8 text-center border-t border-[#E5E0D8] bg-white/20 backdrop-blur-xs">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">
                    Engineered by Tiffani Naomi for ALPHV · 2026
                </p>
            </footer>
        </div>
    );
}