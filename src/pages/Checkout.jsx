import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Checkout page collects a delivery address and payment method, then
// simulates placing an order. On success it generates a random order ID,
// clears the cart, and navigates to the Order Success page.
function Checkout() {
  const { items, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.fullName || '',
    phone: '',
    pincode: '',
    line1: '',
    city: '',
    state: '',
  });
  const [payment, setPayment] = useState('UPI');
  const [error, setError] = useState('');

  // Guard: must be logged in and have items to checkout
  if (!user) return <Navigate to="/login" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  function handleAddressChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function handlePlaceOrder() {
    setError('');
    // Validate required address fields
    const required = ['name', 'phone', 'pincode', 'line1', 'city', 'state'];
    for (const field of required) {
      if (!address[field].trim()) {
        setError('Please complete all address fields.');
        return;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    // Capture order details BEFORE clearing the cart, then persist them
    // in sessionStorage so the success page survives a refresh.
    const orderId = 'OD' + Math.floor(Math.random() * 9000000000 + 1000000000);
    const orderItems = items.map(({ product, quantity }) => {
      const dp = Math.round(product.price - (product.price * product.discount) / 100);
      return {
        name: product.name,
        quantity,
        price: dp,
      };
    });
    const order = {
      orderId,
      payment,
      total: grandTotal,
      subtotal,
      deliveryCharge,
      items: orderItems,
      address: { ...address },
      placedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('flipkart_last_order', JSON.stringify(order));
    // Navigate BEFORE clearing the cart — otherwise the empty-cart guard
    // in this component fires first and redirects to /cart.
    navigate('/order-success', { state: order });
    clearCart();
  }

  return (
    <div className="checkout-page">
      <div className="checkout-main">
        <section className="checkout-section">
          <h3>Delivery Address</h3>
          <div className="address-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={address.name} onChange={handleAddressChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="10-digit mobile" />
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="6-digit pincode" />
            </div>
            <div className="form-group">
              <label htmlFor="line1">Address Line</label>
              <input id="line1" name="line1" value={address.line1} onChange={handleAddressChange} placeholder="House no., street, area" />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={address.city} onChange={handleAddressChange} />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={address.state} onChange={handleAddressChange} />
            </div>
          </div>
        </section>

        <section className="checkout-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            {['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
              <label key={method} className={`payment-option ${payment === method ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                />
                {method}
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="cart-summary">
        <h3>Order Summary</h3>
        {items.map(({ product, quantity }) => {
          const dp = Math.round(product.price - (product.price * product.discount) / 100);
          return (
            <div className="summary-item" key={product.id}>
              <span className="summary-item-name">
                {product.name} × {quantity}
              </span>
              <span>₹{(dp * quantity).toLocaleString('en-IN')}</span>
            </div>
          );
        })}
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charge</span>
          <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
        </div>
        <div className="summary-total">
          <span>Total Amount</span>
          <span>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="btn btn-primary checkout-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </aside>
    </div>
  );
}

export default Checkout;
