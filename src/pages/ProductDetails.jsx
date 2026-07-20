import { useParams, useNavigate, Link } from 'react-router-dom';
import products from '../data/products.json';
import { useCart } from '../context/CartContext';

// Product Details page. Looks up the product by id from the URL param and
// shows a large image, full details, and an Add to Cart button.
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="empty-state">
        <p>Product not found.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const discountedPrice = Math.round(
    product.price - (product.price * product.discount) / 100,
  );

  function handleAdd() {
    addToCart(product);
    navigate('/cart');
  }

  return (
    <div className="product-details">
      <div className="details-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="details-info">
        <p className="details-brand">{product.brand}</p>
        <h1 className="details-name">{product.name}</h1>

        <div className="details-rating">
          <span className="rating-badge">{product.rating} ★</span>
          <span className="rating-count">({Math.floor(product.rating * 23)} ratings)</span>
        </div>

        <div className="details-price">
          <span className="price-discounted price-lg">
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          <span className="price-original">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="price-off price-off-lg">{product.discount}% off</span>
        </div>

        <p className="details-category">Category: {product.category}</p>

        <div className="details-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            Add to Cart
          </button>
          <Link to="/" className="btn btn-secondary">Back</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
