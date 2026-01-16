import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = "₹";
  const navigate = useNavigate();

  // FRONTEND-ONLY STATES
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // ✅ Load products directly from dummyProducts
  const [products, setProducts] = useState(dummyProducts);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ➕ Add to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // 🔄 Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      delete cartData[itemId];
    }
    setCartItems(cartData);
  };

  // ➖ Remove from cart
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  // 🛒 Total cart count
  const getCartCount = () => {
    let count = 0;
    for (const item in cartItems) {
      count += cartItems[item];
    }
    return count;
  };

  // 💰 Total cart amount
  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        total += product.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(total * 100) / 100;
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
