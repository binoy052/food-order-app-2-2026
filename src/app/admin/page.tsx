"use client";

import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [foods, setFoods] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState('foods'); // 'foods' | 'orders'
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchFoods = async () => {
    const res = await fetch('/api/foods');
    const data = await res.json();
    if (Array.isArray(data)) setFoods(data);
    else console.error('API returned non-array:', data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
    else console.error('API returned non-array:', data);
  };

  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, []);

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, imageUrl })
    });
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    fetchFoods();
  };

  const handleDeleteFood = async (id: string) => {
    await fetch(`/api/foods/${id}`, { method: 'DELETE' });
    fetchFoods();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '24px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={tab === 'foods' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('foods')}
        >
          Manage Foods
        </button>
        <button 
          className={tab === 'orders' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('orders')}
        >
          View Orders
        </button>
      </div>

      {tab === 'foods' && (
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ marginBottom: '16px' }}>Add New Food</h2>
            <form onSubmit={handleCreateFood}>
              <div className="form-group">
                <label>Name</label>
                <input required className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input required className="input-field" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input required type="number" step="0.01" className="input-field" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input className="input-field" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary">Add Food</button>
            </form>
          </div>

          <div className="glass-card" style={{ flex: '2', minWidth: '400px' }}>
            <h2 style={{ marginBottom: '16px' }}>Existing Foods</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food: any) => (
                  <tr key={food.id}>
                    <td>{food.name}</td>
                    <td>${food.price.toFixed(2)}</td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteFood(food.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {foods.length === 0 && (
                  <tr><td colSpan={3}>No foods found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '16px' }}>Recent Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td>{order.id.slice(-6)}</td>
                  <td>
                    {order.customerName}<br/>
                    <small style={{ color: '#94a3b8' }}>{order.customerPhone}</small>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      background: order.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: order.status === 'COMPLETED' ? '#4ade80' : '#fbbf24'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'PENDING' && (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                        onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
