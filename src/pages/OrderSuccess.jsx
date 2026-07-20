import { useLocation, Link, Navigate } from 'react-router-dom';

// Order Success page shown after placing an order. It reads the order ID,
// payment method, and total from the navigation state passed by Checkout.
function OrderSuccess() {
  const { state } = useLocation();

  // If the user navigates here directly without placing an order, send
  // them home instead of showing an empty success screen.
  if (!state) return <Navigate to="/" replace />;

  const { orderId, payment, total } = state;

  return (
    <div className="empty-state success-state">
      <div className="success-check">✓</div>
      <h2>Order Placed Successfully!</h2>
      <p className="success-msg">Payment Successful via {payment}</p>
      <div className="order-info">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Total Amount:</strong> ₹{Number(total).toLocaleString('en-IN')}</p>
      </div>
      <p className="success-note">Your cart has been cleared. A confirmation has been sent to your email.</p>
      <Link to="/" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
}

export default OrderSuccess;
