import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Cart page lists every item in the cart with quantity controls and a
// price summary. Users can remove items, change quantities, or clear the
// whole cart. Checkout requires the user to be logged in.
function Cart() {
  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    deliveryCharge,
    grandTotal,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started.</p>
        <Link to="/" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        <div className="cart-head">
          <h2>My Cart ({totalItems})</h2>
          <button className="btn-link danger" onClick={clearCart}>Clear Cart</button>
        </div>

        {items.map(({ product, quantity }) => {
          const discountedPrice = Math.round(
            product.price - (product.price * product.discount) / 100,
          );
          return (
            <div className="cart-item" key={product.id}>
              <Link to={`/product/${product.id}`} className="cart-item-img">
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/product/${product.id}`} className="cart-item-name">
                  {product.name}
                </Link>
                <p className="cart-item-brand">{product.brand}</p>
                <div className="cart-item-price">
                  <span className="price-discounted">
                    ₹{discountedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="price-original">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="price-off">{product.discount}% off</span>
                </div>
              </div>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => decreaseQty(product.id)} aria-label="Decrease quantity">−</button>
                  <span>{quantity}</span>
                  <button onClick={() => increaseQty(product.id)} aria-label="Increase quantity">+</button>
                </div>
                <button
                  className="btn-link danger"
                  onClick={() => removeFromCart(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="cart-summary">
        <h3>Price Details</h3>
        <div className="summary-row">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charge</span>
          <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
        </div>
        <div className="summary-total">
          <span>Grand Total</span>
          <span>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
        <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
          {user ? 'Proceed to Checkout' : 'Login to Checkout'}
        </button>
      </aside>
    </div>
  );
}

export default Cart;
