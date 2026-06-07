import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShapeRenderer = ({ shape, color }) => {
    const size = 32;
    if (shape === 'circle') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><circle cx="50" cy="50" r="40" fill={color} /></svg>;
    if (shape === 'square') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><rect x="10" y="10" width="80" height="80" fill={color} /></svg>;
    if (shape === 'triangle') return <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}><polygon points="50,15 90,85 10,85" fill={color} /></svg>;
    return null;
};

export default function UserPortal() {
    const [items, setItems] = useState([]);
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
                navigate('/auth?role=user');
            } else {
                console.error("Failed to fetch items. Status:", res.status);
            }
        } catch (error) {
            console.error("Network error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems();

        // Strict read-only WebSockets to update grid instantly
        const ws = new WebSocket('ws://localhost:8000/ws/items/');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'update_matrix' || data.type === 'item_update') {
                fetchItems();
            }
        };
        ws.onerror = (err) => console.error("WebSocket Error:", err);

        return () => ws.close();
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>User Portal (Read-Only Matrix)</h2>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '10px 20px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px', borderRadius: '9999px' }}>Logout</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '30px' }}>
                <thead><tr style={{ borderBottom: '2px solid black' }}><th>Timestamp</th><th>Name</th><th>Shapecolor</th></tr></thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td>{new Date(item.timestamp).toLocaleString()}</td>
                            <td>{item.name}</td>
                            <td><ShapeRenderer shape={item.shape} color={item.color} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}