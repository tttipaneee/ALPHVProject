import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShapeRenderer = ({ shape, color }) => {
    const size = 32;
    if (shape === 'circle') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><circle cx="50" cy="50" r="40" fill={color} /></svg>;
    if (shape === 'square') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><rect x="10" y="10" width="80" height="80" fill={color} /></svg>;
    if (shape === 'triangle') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><polygon points="50,15 90,85 10,85" fill={color} /></svg>;
    return null;
};

export default function AdminPortal() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', shape: 'circle', color: 'red' });
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchItems = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/items/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Safely handle both standard arrays and DRF paginated responses
                setItems(Array.isArray(data) ? data : data.results || []);
            } else if (res.status === 401) {
                localStorage.removeItem('token');
                navigate('/auth?role=admin');
            } else {
                console.error("Failed to fetch items. Status:", res.status);
            }
        } catch (error) {
            console.error("Network error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems();

        // Let the Admin tap into the WebSockets too, in case there are multiple admins!
        const ws = new WebSocket('ws://localhost:8000/ws/items/');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Tap into the exact type your Django Consumer broadcasts
            if (data.type === 'update_matrix' || data.type === 'item_update') fetchItems();
        };
        ws.onerror = (err) => console.error("WebSocket Error:", err);

        return () => ws.close();
    }, []);

    const handleEdit = (item) => {
        setForm({ name: item.name, shape: item.shape, color: item.color });
        setEditingId(item.id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict Frontend Validation Check
        if (!form.name.trim() || !['red', 'blue', 'green', 'yellow'].includes(form.color) || !['circle', 'square', 'triangle'].includes(form.shape)) {
            alert('Invalid input. Ensure all fields are filled properly.');
            return;
        }

        const url = editingId ? `http://localhost:8000/api/items/${editingId}/` : 'http://localhost:8000/api/items/';
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setForm({ name: '', shape: 'circle', color: 'red' });
            setEditingId(null);
        } else {
            const err = await res.json();
            alert('Validation Error: ' + JSON.stringify(err));
        }
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8000/api/items/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    return (
        <div style={{ padding: '40px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Admin Portal (Full Access)</h2>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ borderRadius: '9999px', padding: '6px 16px' }}>Logout</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', margin: '30px 0', background: '#f5f5f5', padding: '20px' }}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: '8px' }} />
                <select value={form.shape} onChange={e => setForm({ ...form, shape: e.target.value })} required style={{ padding: '8px' }}>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                </select>
                <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} required style={{ padding: '8px' }}>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                </select>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '9999px' }}>{editingId ? 'Update Item' : 'Add Item'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', shape: 'circle', color: 'red' }) }} style={{ borderRadius: '9999px', padding: '6px 16px' }}>Cancel</button>}
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ borderBottom: '2px solid black' }}><th>Timestamp</th><th>Name</th><th>Shapecolor</th><th>Actions</th></tr></thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td>{new Date(item.timestamp).toLocaleString()}</td>
                            <td>{item.name}</td>
                            <td><ShapeRenderer shape={item.shape} color={item.color} /></td>
                            <td><button onClick={() => handleEdit(item)} style={{ marginRight: '10px', borderRadius: '9999px', padding: '4px 12px' }}>Edit</button><button onClick={() => handleDelete(item.id)} style={{ borderRadius: '9999px', padding: '4px 12px' }}>Delete</button></td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}