import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

// CartContext keeps the shopping cart in localStorage so it persists
// across page refreshes. Each cart item is { product, quantity }.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load saved cart on first render
  useEffect(() => {
    const saved = localStorage.getItem('flipkart_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Persist to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('flipkart_cart', JSON.stringify(items));
  }, [items]);

  // Add a product (or increase quantity if already in cart)
  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  // Remove a product entirely from the cart
  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  // Increase quantity by 1
  function increaseQty(productId) {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }

  // Decrease quantity by 1, removing the item if it hits zero
  function decreaseQty(productId) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  // Empty the entire cart (used after placing an order)
  function clearCart() {
    setItems([]);
  }

  // Derived totals used by the cart and checkout pages
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  // Free delivery over ₹500, otherwise ₹40
  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalItems,
        subtotal,
        deliveryCharge,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
