import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dynamic API and WS URLs derived from environment variables, with local defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

/**
 * ShapeRenderer Component
 * Renders geometric SVG elements styled according to shape types and color parameters.
 */
const ShapeRenderer = ({ shape, color }) => {
    const size = 36;
    
    // Curated theme color maps
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
 * AdminPortal Component
 * Administrative interface providing privileged CRUD controls over shape catalog data.
 * Validates input parameters locally and processes database updates via API.
 */
export default function AdminPortal() {
    const [items, setItems] = useState([]);
    
    // Deployed shape state fields
    const [form, setForm] = useState({ name: '', shape: 'circle', color: 'red' });
    const [editingId, setEditingId] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    /**
     * Fetches current shapes database list from backend REST API.
     */
    const fetchItems = async () => {
        console.log(`[Admin Portal] Requesting visual items from REST API: ${API_URL}/api/items/`);
        try {
            const res = await fetch(`${API_URL}/api/items/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`[Admin Portal] List API responded with status: ${res.status}`);
            
            if (res.ok) {
                const data = await res.json();
                const fetchedList = Array.isArray(data) ? data : data.results || [];
                console.log(`[Admin Portal] Successfully loaded ${fetchedList.length} items from database.`);
                setItems(fetchedList);
            } else if (res.status === 401) {
                console.warn("[Admin Portal] JWT Token expired or rejected (401). Evicting session and redirecting...");
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/auth?role=admin');
            } else {
                console.error("[Admin Portal] Server endpoint query failed with status code:", res.status);
            }
        } catch (error) {
            console.error("[Admin Portal] Fetch exception encountered during API connection:", error);
        }
    };

    // WebSocket real-time synchronization hook
    useEffect(() => {
        const role = localStorage.getItem('role');
        console.log("[Admin Portal] Initializing dashboard component lifecycle. Active Role Claim:", role);

        // Client-side role authorization check
        if (role !== 'admin') {
            console.warn("[Admin Portal] Unauthorized role access. Redirecting user to Admin Login page.");
            navigate('/auth?role=admin');
            return;
        }

        // Fetch initial list state
        fetchItems();

        const wsEndpoint = `${WS_URL}/ws/items/`;
        console.log(`[Admin Portal] Initializing real-time synchronization socket at: ${wsEndpoint}`);
        
        const ws = new WebSocket(wsEndpoint);

        // Open handler
        ws.onopen = () => {
            console.log("[Admin Portal] WebSocket connection established successfully. Live synchronizer is active.");
        };

        // Message handler: triggers refresh query on state broadcast
        ws.onmessage = (event) => {
            console.log("[Admin Portal] Real-time event received from Daphne server. Event frame payload:", event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'update_matrix' || data.type === 'item_update') {
                console.log("[Admin Portal] State mutation detected. Dispatching API refresh fetch...");
                fetchItems();
            }
        };

        // Error handler
        ws.onerror = (err) => {
            console.error("[Admin Portal] WebSocket synchronization pipeline encountered an error state:", err);
        };

        // Close handler
        ws.onclose = (e) => {
            console.log("[Admin Portal] WebSocket connection terminated. Event code:", e.code);
        };

        // Clean up socket on unmount
        return () => {
            console.log("[Admin Portal] Component unmounting. Terminating socket channel.");
            ws.close();
        };
    }, []);

    /**
     * Loads shape record details into the inputs form to initiate edit process.
     * @param {object} item - Database shape item record
     */
    const handleEdit = (item) => {
        console.log(`[Admin Portal] Loading shape ID ${item.id} details into edit form.`);
        
        // Normalize shape and color configurations to lowercase to avoid strict checks validation mismatch
        setForm({ 
            name: item.name, 
            shape: item.shape.toLowerCase(), 
            color: item.color.toLowerCase() 
        });
        setEditingId(item.id);
    };

    /**
     * Submits form payload to API endpoints to add or modify records.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("[Admin Portal] Initiating form validation check...");

        // Double-guard local verification
        if (!form.name.trim() || !['red', 'blue', 'green', 'yellow'].includes(form.color.toLowerCase()) || !['circle', 'square', 'triangle'].includes(form.shape.toLowerCase())) {
            console.warn("[Admin Portal] Local input validation failed! Rejecting payload dispatch.", form);
            alert('Invalid input. Ensure all fields are filled properly.');
            return;
        }

        const url = editingId ? `${API_URL}/api/items/${editingId}/` : `${API_URL}/api/items/`;
        const method = editingId ? 'PUT' : 'POST';

        console.log(`[Admin Portal] Dispatching database mutation. Method: ${method}, URL: ${url}, Payload:`, form);

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            console.log(`[Admin Portal] Server mutation response code: ${res.status}`);

            if (res.ok) {
                console.log("[Admin Portal] Shape deployment/modification completed successfully. Resetting form state.");
                setForm({ name: '', shape: 'circle', color: 'red' });
                setEditingId(null);
                fetchItems();
            } else {
                const err = await res.json();
                console.error("[Admin Portal] Server validation error returned:", err);
                alert('Validation Error: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error("[Admin Portal] HTTP exception encountered during mutation submit:", error);
        }
    };

    /**
     * Sends DELETE request to remove shape record from database.
     * @param {number} id - Database target record ID
     */
    const handleDelete = async (id) => {
        const url = `${API_URL}/api/items/${id}/`;
        console.log(`[Admin Portal] Dispatching DELETE request to: ${url}`);
        
        try {
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`[Admin Portal] Delete API responded with status: ${res.status}`);
            
            if (res.ok) {
                console.log(`[Admin Portal] Record ID ${id} deleted successfully. Refreshing database catalog...`);
                fetchItems();
            } else {
                console.error(`[Admin Portal] Delete request for record ID ${id} failed with status:`, res.status);
            }
        } catch (error) {
            console.error("[Admin Portal] HTTP exception encountered during delete request:", error);
        }
    };

    /**
     * Handles user signout, clearing browser local memory.
     */
    const handleLogout = () => {
        console.log("[Admin Portal] Initiating logout. Cleaning localStorage session keys...");
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
                            ShapeStream Admin
                        </h1>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                            Full Control CRUD Panel
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Logout button */}
                        <button 
                            onClick={handleLogout} 
                            className="bg-[#EFEBE4] hover:bg-[#E5DFD5] text-gray-900 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-2xs"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Control Panel Card */}
                    <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm flex flex-col justify-start h-fit lg:sticky lg:top-8">
                        <h2 className="text-xl font-serif text-gray-900 font-normal mb-6">
                            {editingId ? 'Edit Shape Details' : 'Deploy New Shape'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shape Name Input */}
                            <div>
                                <label className="block text-[10px] font-bold mb-2 text-gray-400 uppercase tracking-widest pl-2">
                                    Name
                                </label>
                                <div className={`relative flex items-center bg-white border rounded-full px-4 py-1 transition-all duration-200 ${focusedField === 'name' ? 'border-gray-900 ring-2 ring-gray-900/5' : 'border-[#E5E0D8] hover:border-gray-300'}`}>
                                    {/* SVG Input Icon */}
                                    <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Daren Tan"
                                        value={form.name} 
                                        onChange={e => setForm({ ...form, name: e.target.value })} 
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required 
                                        className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-gray-800 placeholder-gray-300 py-2.5"
                                    />
                                </div>
                            </div>

                            {/* Shape Selector */}
                            <div>
                                <label className="block text-[10px] font-bold mb-2 text-gray-400 uppercase tracking-widest pl-2">
                                    Select Shape
                                </label>
                                <div className="relative flex items-center bg-[#EFEBE4] rounded-full px-5 py-3 hover:bg-[#E5DFD5] transition-all">
                                    <select 
                                        value={form.shape} 
                                        onChange={e => setForm({ ...form, shape: e.target.value })} 
                                        required 
                                        className="w-full bg-transparent border-0 outline-none text-xs font-bold text-gray-700 cursor-pointer appearance-none pr-8"
                                    >
                                        <option value="circle">Circle</option>
                                        <option value="square">Square</option>
                                        <option value="triangle">Triangle</option>
                                    </select>
                                    <div className="absolute right-5 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <label className="block text-[10px] font-bold mb-2 text-gray-400 uppercase tracking-widest pl-2">
                                    Select Color
                                </label>
                                <div className="relative flex items-center bg-[#EFEBE4] rounded-full px-5 py-3 hover:bg-[#E5DFD5] transition-all">
                                    <select 
                                        value={form.color} 
                                        onChange={e => setForm({ ...form, color: e.target.value })} 
                                        required 
                                        className="w-full bg-transparent border-0 outline-none text-xs font-bold text-gray-700 cursor-pointer appearance-none pr-8"
                                    >
                                        <option value="red">Red (Coral)</option>
                                        <option value="blue">Blue</option>
                                        <option value="green">Green</option>
                                        <option value="yellow">Yellow</option>
                                    </select>
                                    <div className="absolute right-5 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-gray-900 hover:bg-black text-white py-3.5 px-6 rounded-full text-xs font-bold tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
                                >
                                    {editingId ? 'Update' : 'Deploy'}
                                </button>
                                {editingId && (
                                    <button 
                                        type="button" 
                                        onClick={() => { 
                                            console.log("[Admin Portal] Cancelling edit action. Resetting form state.");
                                            setEditingId(null); 
                                            setForm({ name: '', shape: 'circle', color: 'red' });
                                        }} 
                                        className="bg-[#EFEBE4] hover:bg-[#E5DFD5] text-gray-900 py-3.5 px-6 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer shadow-2xs"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Canvas & Table columns */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Visual grid */}
                        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
                            <h2 className="text-lg font-serif text-gray-900 font-normal mb-6">Live Grid Board</h2>
                            
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 bg-[#F6F5F2] rounded-2xl border border-dashed border-[#E5E0D8]">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No Deployed Shapes</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-[#F6F5F2] p-6 rounded-2xl border border-[#E5E0D8]">
                                    {items.map(item => (
                                        <div key={item.id} className="bg-white p-3.5 rounded-xl border border-[#E5E0D8] flex flex-col items-center justify-center text-center shadow-3xs">
                                            <div className="mb-2">
                                                <ShapeRenderer shape={item.shape} color={item.color} />
                                            </div>
                                            <div className="text-xs font-bold text-gray-800 truncate w-full">{item.name}</div>
                                            <div className="text-[9px] font-semibold text-gray-400 uppercase mt-0.5 tracking-wider">
                                                {item.shape}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editable Items Table */}
                        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
                            <h2 className="text-lg font-serif text-gray-900 font-normal mb-6 font-serif">Deployed Catalog</h2>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#E5E0D8]">
                                            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">Details</th>
                                            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 text-center">Shape</th>
                                            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E0D8]/50">
                                        {items.map(item => (
                                            <tr key={item.id} className="group hover:bg-[#F6F5F2]/50 transition-colors">
                                                <td className="py-4">
                                                    <div className="text-xs font-bold text-gray-800">{item.name}</div>
                                                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <ShapeRenderer shape={item.shape} color={item.color} />
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Edit pill (Pale Beige) */}
                                                        <button 
                                                            onClick={() => handleEdit(item)} 
                                                            className="bg-[#EFEBE4] hover:bg-[#E5DFD5] text-gray-900 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                                                        >
                                                            Edit
                                                        </button>
                                                        {/* Delete pill (White with border) */}
                                                        <button 
                                                            onClick={() => handleDelete(item.id)} 
                                                            className="bg-white border border-[#E5E0D8] hover:border-red-300 hover:text-red-500 text-gray-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {items.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    No shapes deployed on this canvas
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}