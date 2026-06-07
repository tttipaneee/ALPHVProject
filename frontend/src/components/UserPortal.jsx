import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dynamic API and WS URLs derived from environment variables, with local defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

/**
 * ShapeRenderer Component
 * Renders high-fidelity SVGs of geometric shapes matching their color maps.
 */
const ShapeRenderer = ({ shape, color }) => {
    const size = 36;
    
    // Design system curated color palette
    const colorMap = {
        red: '#E87A5D', // Coral accent
        blue: '#5C85FF',
        green: '#48BB78',
        yellow: '#ECC94B'
    };
    
    const fill = colorMap[color.toLowerCase()] || color;

    if (shape === 'circle') {
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block drop-shadow-sm transition-transform hover:scale-110">
                <circle cx="50" cy="50" r="40" fill={fill} />
            </svg>
        );
    }
    if (shape === 'square') {
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block drop-shadow-sm transition-transform hover:scale-110">
                <rect x="12" y="12" width="76" height="76" rx="12" fill={fill} />
            </svg>
        );
    }
    if (shape === 'triangle') {
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block drop-shadow-sm transition-transform hover:scale-110">
                <polygon points="50,15 90,85 10,85" fill={fill} />
            </svg>
        );
    }
    return null;
};

/**
 * UserPortal Component
 * Displays the deployed shapes visual matrix grid and logs.
 * Receives server state updates via live WebSockets connections.
 */
export default function UserPortal() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    /**
     * Fetches current shapes catalog from the REST API endpoints.
     */
    const fetchItems = async () => {
        if (!token) {
            console.warn("[User Portal] Token is missing from localStorage. Skipping API fetch.");
            return;
        }
        console.log(`[User Portal] Triggering fetch request to REST API: ${API_URL}/api/items/`);
        try {
            const res = await fetch(`${API_URL}/api/items/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`[User Portal] Fetch API responded with code: ${res.status}`);
            
            if (res.ok) {
                const data = await res.json();
                const fetchedList = Array.isArray(data) ? data : data.results || [];
                console.log(`[User Portal] Successfully loaded ${fetchedList.length} shape elements from database.`);
                setItems(fetchedList);
            } else if (res.status === 401) {
                console.warn("[User Portal] Token credentials rejected (401). Evicting session and redirecting...");
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/auth?role=user');
            } else {
                console.error("[User Portal] Server endpoint query failed with status code:", res.status);
            }
        } catch (error) {
            console.error("[User Portal] Fetch exception encountered during API handshake:", error);
        }
    };

    // WebSocket real-time synchronization hook
    useEffect(() => {
        const role = localStorage.getItem('role');
        console.log("[User Portal] Initializing dashboard component lifecycle. Active Role Claim:", role);

        // Client-side role authorization check
        if (role !== 'user' && role !== 'admin') {
            console.warn("[User Portal] Unauthorized role access. Redirecting user to Login page.");
            navigate('/auth?role=user');
            return;
        }

        // Fetch initial list state
        fetchItems();

        const wsEndpoint = `${WS_URL}/ws/items/`;
        console.log(`[User Portal] Initializing real-time synchronization socket at: ${wsEndpoint}`);
        
        const ws = new WebSocket(wsEndpoint);

        // Open handler
        ws.onopen = () => {
            console.log("[User Portal] WebSocket connection established successfully. Live synchronizer is active.");
        };

        // Message handler: triggers refresh query on state broadcast
        ws.onmessage = (event) => {
            console.log("[User Portal] Real-time event received from Daphne server. Event frame payload:", event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'update_matrix' || data.type === 'item_update') {
                console.log("[User Portal] State mutation detected. Dispatching API refresh fetch...");
                fetchItems();
            }
        };

        // Error handler
        ws.onerror = (err) => {
            console.error("[User Portal] WebSocket synchronization pipeline encountered an error state:", err);
        };

        // Close handler
        ws.onclose = (e) => {
            console.log("[User Portal] WebSocket connection terminated. Event code:", e.code);
        };

        // Clean up socket on unmount
        return () => {
            console.log("[User Portal] Component unmounting. Terminating socket channel.");
            ws.close();
        };
    }, []);

    /**
     * Handles user signout, clearing browser local memory.
     */
    const handleLogout = () => {
        console.log("[User Portal] Initiating logout. Cleaning localStorage session keys...");
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F6F5F2] py-10 px-6 sm:px-12 font-sans animate-fade-in">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Navbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E0D8] pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">
                            ShapeStream Portal
                        </h1>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                            Live Read-Only Grid Matrix
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Logout button (Pale Beige Pill) */}
                        <button 
                            onClick={handleLogout} 
                            className="bg-[#EFEBE4] hover:bg-[#E5DFD5] text-gray-900 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-2xs"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Live Visual Board (2 columns wide on large screens) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-serif text-gray-900 font-normal">Live Shape Canvas</h2>
                            <span className="bg-[#EFEBE4] text-[10px] font-bold text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                {items.length} Deployed
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-[#F6F5F2] rounded-2xl border border-dashed border-[#E5E0D8]">
                                <svg className="w-12 h-12 text-gray-300 mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No Deployed Shapes Yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 bg-[#F6F5F2] p-6 rounded-2xl border border-[#E5E0D8]">
                                {items.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-[#E5E0D8] flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-sm transition-all">
                                        <div className="mb-3">
                                            <ShapeRenderer shape={item.shape} color={item.color} />
                                        </div>
                                        <div className="text-xs font-bold text-gray-800 truncate w-full">{item.name}</div>
                                        <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                                            {item.shape} · {item.color}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* History Feed Log (1 column wide) */}
                    <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
                        <h2 className="text-lg font-serif text-gray-900 font-normal mb-6">History Log</h2>
                        
                        <div className="overflow-y-auto max-h-[400px] pr-2 space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#E5E0D8] last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#EFEBE4] w-10 h-10 rounded-full flex items-center justify-center shadow-3xs">
                                            <ShapeRenderer shape={item.shape} color={item.color} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800">{item.name}</div>
                                            <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                                                {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-[10px] font-bold text-[#E87A5D] bg-orange-50 border border-orange-100 rounded-full px-3 py-1 uppercase tracking-wider shadow-3xs">
                                        {item.color}
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <p className="text-xs font-semibold text-gray-400 text-center py-10 uppercase tracking-wider">No Activity Logged</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}