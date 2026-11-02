import { createContext, useContext, useState } from "react";
import { useProducts } from "./productsContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { getPriceDetails } = useProducts();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (current) =>
          current.productId === item.productId &&
          current.variantId === item.variantId,
      );
      if (!existing) return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      return prevItems.map((current) =>
        current === existing
          ? {
              ...current,
              ...item,
              quantity: current.quantity + (item.quantity || 1),
            }
          : current,
      );
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQty = (productId, variantId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: nextQuantity }
          : item,
      ),
    );
  };

  const removeItem = (productId, variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.productId !== productId || item.variantId !== variantId,
      ),
    );
  };

  const clear = () => setCartItems([]);
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotalUsd = cartItems.reduce(
    (total, item) =>
      total + getPriceDetails(item).usd * item.quantity,
    0,
  );
  const subtotalKsh = cartItems.reduce(
    (total, item) => total + getPriceDetails(item).ksh * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        items: cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        removeItem,
        clear,
        count,
        subtotalUsd,
        subtotalKsh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
