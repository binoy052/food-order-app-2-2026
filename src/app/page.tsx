"use client";

import { useState, useEffect } from 'react';

export default function CustomerFrontend() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/foods')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFoods(data);
        else console.error('API returned non-array:', data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (food: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.food.id === food.id);
      if (existing) {
        return prev.map(item => item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart(prev => prev.filter(item => item.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(foodId);
    setCart(prev => prev.map(item => item.food.id === foodId ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      address,
      totalAmount: cartTotal,
      items: cart.map(item => ({
        foodId: item.food.id,
        quantity: item.quantity,
        price: item.food.price
      }))
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      setOrderSuccess(true);
      setCart([]);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setAddress('');
      setTimeout(() => {
        setOrderSuccess(false);
        setShowCheckout(false);
      }, 3000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      
      {/* Main Menu */}
      <div style={{ flex: '2', minWidth: '300px' }}>
        <h1 style={{ marginBottom: '24px' }}>Our Menu</h1>
        <div className="food-grid">
          {foods.map((food: any) => (
            <div key={food.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {food.imageUrl ? (
                <img src={food.imageUrl} alt={food.name} className="food-image" />
              ) : (
                <div className="food-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  No Image
                </div>
              )}
              <h3>{food.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '8px', flexGrow: 1 }}>{food.description}</p>
              <div className="food-price">${food.price.toFixed(2)}</div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => addToCart(food)}>
                Add to Cart
              </button>
            </div>
          ))}
          {loading && <p>Loading menu...</p>}
          {!loading && foods.length === 0 && <p>No foods available yet. Check back later!</p>}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="glass-card cart-summary" style={{ flex: '1', minWidth: '320px' }}>
        <h2 style={{ marginBottom: '16px' }}>Your Cart</h2>
        
        {cart.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Cart is empty.</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.food.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{item.food.name}</h4>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>${item.food.price.toFixed(2)} x {item.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => updateQuantity(item.food.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => updateQuantity(item.food.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            ))}
            
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Total:</strong>
              <strong style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>${cartTotal.toFixed(2)}</strong>
            </div>

            {!showCheckout ? (
              <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            ) : (
              <div style={{ marginTop: '24px' }} className="animate-fade-in">
                <h3 style={{ marginBottom: '16px' }}>Checkout Details</h3>
                {orderSuccess ? (
                  <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    Order placed successfully!
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder}>
                    <div className="form-group">
                      <label>Name</label>
                      <input required className="input-field" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input required type="email" className="input-field" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input required className="input-field" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Delivery Address</label>
                      <textarea required className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" className="btn-secondary" style={{ flex: '1' }} onClick={() => setShowCheckout(false)}>Cancel</button>
                      <button type="submit" className="btn-primary" style={{ flex: '1' }}>Place Order</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
