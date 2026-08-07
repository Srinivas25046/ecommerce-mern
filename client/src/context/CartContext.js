import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((item) => item._id === product._id);

    let updatedItems;
    if (existItem) {
      updatedItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, qty } : item
      );
    } else {
      updatedItems = [...cartItems, { ...product, qty }];
    }

    saveCart(updatedItems);
  };

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((item) => item._id !== id);
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};