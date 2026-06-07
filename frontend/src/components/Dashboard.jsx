import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// --- VALIDATION & RENDERER ---
const itemSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }).max(255),
    shape: z.enum(['circle', 'square', 'triangle']),
    color: z.enum(['red', 'blue', 'green', 'yellow'])
});

const ShapeRenderer = ({ shape, color }) => {
    const size = 64;
    const fillClass = { red: '#ff0000', blue: '#23238e', green: '#008000', yellow: '#ffcc33' }[color.toLowerCase()] || '#94a3b8';
    if (shape === 'circle') return <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto"><circle cx="50" cy="50" r="40" fill={fillClass} /></svg>;
    if (shape === 'square') return <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto"><rect x="10" y="10" width="80" height="80" fill={fillClass} /></svg>;
    if (shape === 'triangle') return <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto"><polygon points="50,15 90,85 10,85" fill={fillClass} /></svg>;
    return null;
};

// --- MAIN COMPONENT ---
export default function Dashboard({ token, setToken }) {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [shape, setShape] = useState('circle');
    const [color, setColor] = useState('red');

    const API_URL = 'http://localhost:8000/api/items/';

    const fetchItems = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` } // Added auth header for secure fetching
            });
            if (response.status === 401) {
                handleLogout(); // Automatically log out if session expired
                return;
            }
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error("API Connection Error", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchItems();
            const ws = new WebSocket('ws://localhost:8000/ws/items/');

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'update_matrix') {
                    fetchItems();
                }
            };

            return () => ws.close();
        }
    }, [token]);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        toast.success('Logged out securely');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationResult = itemSchema.safeParse({ name, shape, color });
        if (!validationResult.success) {
            toast.error(validationResult.error.errors[0].message);
            return;
        }

        const submitPromise = fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, shape, color })
        }).then(async (res) => {
            if (!res.ok) throw new Error('Failed to add item');
            return res.json();
        });

        toast.promise(submitPromise, {
            loading: 'Saving record...',
            success: () => {
                setName('');
                fetchItems();
                return 'Record added successfully!';
            },
            error: 'Could not save record.',
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Record deleted');
                fetchItems();
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error('Network error during deletion');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <header className="mb-8 flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Interactive Shape Matrix</h1>
                <button onClick={handleLogout} className="bg-slate-600 text-white px-6 py-3 rounded-full shadow hover:bg-slate-700 transition font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Exit Admin Session
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald-500">
                    <h2 className="text-xl font-bold mb-4 text-slate-700">Admin Control Deck</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-600">Name</label>
                            <input type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Albert" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-600">Shape</label>
                            <select className="w-full border rounded p-2" value={shape} onChange={e => setShape(e.target.value)}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="triangle">Triangle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-600">Color Variant</label>
                            <select className="w-full border rounded p-2" value={color} onChange={e => setColor(e.target.value)}>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="yellow">Yellow</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full font-semibold hover:bg-emerald-700 transition h-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Add Record
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 text-slate-700">Database Records</h2>
                    <div className="overflow-x-auto border rounded-sm border-black">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-black">
                                    <th className="p-3 font-bold border-r border-black text-black">Timestamp</th>
                                    <th className="p-3 font-bold border-r border-black text-black">Name</th>
                                    <th className="p-3 font-bold text-center text-black">Shape</th>
                                    <th className="p-3 text-slate-400 font-normal text-sm w-16 text-center border-l border-slate-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-slate-400">No records inside database yet.</td></tr>
                                ) : (
                                    items.map(item => (
                                        <tr key={item.id} className="border-b border-black hover:bg-slate-50 transition">
                                            <td className="p-3 text-sm text-black border-r border-black w-1/3">
                                                {new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false })} {new Date(item.timestamp).toISOString().split('T')[0]}
                                            </td>
                                            <td className="p-3 font-normal text-black border-r border-black w-1/3">{item.name}</td>
                                            <td className="p-2 text-center w-1/3"><ShapeRenderer shape={item.shape} color={item.color} /></td>
                                            <td className="p-2 text-center border-l border-slate-200 align-middle">
                                                <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>✕</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}