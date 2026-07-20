import { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

// Order Success page shown after placing an order. It reads the full
// order details from navigation state (or sessionStorage on refresh)
// and shows a "Payment Completed / Order Processed" confirmation with
// the ordered items, delivery address, and order summary.
function OrderSuccess() {
  const { state } = useLocation();
  const [order, setOrder] = useState(state || null);
  const [checked, setChecked] = useState(false);

  // If we arrived without state (e.g. page refresh), try to recover the
  // last order from sessionStorage so the confirmation still shows.
  useEffect(() => {
    if (!order) {
      const saved = sessionStorage.getItem('flipkart_last_order');
      if (saved) setOrder(JSON.parse(saved));
    }
    setChecked(true);
  }, [order]);

  // While we're still checking for saved order data, show nothing yet
  if (!checked) return null;

  // If there's genuinely no order to show, send the user home
  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="order-success-page">
      {/* Confirmation banner */}
      <div className="success-banner">
        <div className="success-check">✓</div>
        <h1>Payment Completed!</h1>
        <p className="success-status">Your order has been processed successfully.</p>
        <div className="order-id-row">
          <span className="order-id-label">Order ID:</span>
          <span className="order-id-value">{order.orderId}</span>
        </div>
        <p className="order-date">
          Placed on {new Date(order.placedAt).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="success-body">
        {/* Ordered items */}
        <section className="success-section">
          <h2>Order Summary</h2>
          <div className="success-items">
            {order.items.map((item, idx) => (
              <div className="success-item" key={idx}>
                <span className="success-item-name">{item.name}</span>
                <span className="success-item-qty">Qty: {item.quantity}</span>
                <span className="success-item-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="success-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="summary-total">
              <span>Total Paid</span>
              <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
            <div className="payment-paid">
              Paid via <strong>{order.payment}</strong>
            </div>
          </div>
        </section>

        {/* Delivery address */}
        <section className="success-section">
          <h2>Delivery Address</h2>
          <div className="success-address">
            <p className="addr-name">{order.address.name}</p>
            <p>{order.address.line1}</p>
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p>Phone: {order.address.phone}</p>
          </div>

          <div className="delivery-note">
            <span className="delivery-icon">🚚</span>
            <p>Expected delivery in 3-5 business days.</p>
          </div>
        </section>
      </div>

      <div className="success-actions">
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
