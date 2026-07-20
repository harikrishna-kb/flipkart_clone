import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Profile page shows the logged-in user's basic info and a logout button.
// If nobody is logged in, the user is redirected to the login page.
function Profile() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.fullName}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-meta">Items in cart: {totalItems}</p>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/cart" className="btn btn-secondary">View Cart</Link>
        <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
        <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
