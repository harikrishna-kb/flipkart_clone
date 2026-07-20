import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Navbar is shown on every page. It contains the Flipkart-style logo, a
// search bar (which routes to Home with a query param), and quick links
// to Home, Login/Logout, Cart, and Profile.
function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    // Navigate to home with the search query string
    navigate(`/?q=${encodeURIComponent(term)}`);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">Flipkart</span>
          <span className="logo-sub">Explore Plus</span>
        </Link>

        {/* Search bar (hidden on very small screens) */}
        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {/* Navigation links */}
        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-user">
                {user.fullName.split(' ')[0]}
              </Link>
              <button className="btn-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <Link to="/cart" className="cart-link">
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Small inline SVG so we don't pull in an icon library
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default Navbar;
