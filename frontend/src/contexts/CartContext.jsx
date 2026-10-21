import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

const sampleCartItems = [
  {
    id: 1,
    productId: 101,
    variantId: 201,
    name: "Product 1",
    variantName: "Variant A",
    imageUrl: "https://via.placeholder.com/150",
    unitPriceCents: 1000,
    quantity: 2,
    currency: "USD",
    slug: "product-1",
  },
  {
    id: 2,
    productId: 102,
    variantId: 202,
    name: "Product 2",
    variantName: "Variant B",
    imageUrl: "https://via.placeholder.com/150",
    unitPriceCents: 2000,
    quantity: 1,
    currency: "USD",
    slug: "product-2",
  },
  {
    id: 3,
    productId: 103,
    variantId: 203,
    name: "Product 3",
    variantName: "Variant C",
    imageUrl: "https://via.placeholder.com/150",
    unitPriceCents: 1500,
    quantity: 3,
    currency: "USD",
    slug: "product-3",
  },
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(sampleCartItems);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQty = (productId, variantId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
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
  const subtotalCents = cartItems.reduce(
    (total, item) => total + item.unitPriceCents * item.quantity,
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
        subtotalCents,
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
