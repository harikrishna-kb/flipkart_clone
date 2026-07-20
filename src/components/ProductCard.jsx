import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ProductCard displays a single product in the grid. It computes the
// discounted price from the discount percentage and shows a star rating.
function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountedPrice = Math.round(
    product.price - (product.price * product.discount) / 100,
  );

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          <div className="product-rating">
            <span className="rating-badge">{product.rating} ★</span>
          </div>
          <div className="product-price-row">
            <span className="price-discounted">₹{discountedPrice.toLocaleString('en-IN')}</span>
            <span className="price-original">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="price-off">{product.discount}% off</span>
          </div>
        </div>
      </Link>
      <button
        className="btn add-cart-btn"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
