import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext({
  cartItems: [],
  fetchCart: async () => {},
  setCartItems: (items: any[]) => {},
  removeItemFromCart: async (productId: string) => {},
  updateQuantityOnServer: async (productId: string, quantity: number) => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    if (!user._id) return;
    const res = await axios.get(`http://localhost:5000/api/cart?user=${user._id}`);
    const items = res.data?.items || [];
    setCartItems(
      items
        .filter(item => item.product)
        .map(item => ({
          ...item.product,
          quantity: 1,
          id: item.product._id,
        }))
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng trên backend
  const removeItemFromCart = async (productId: string) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    await axios.post("http://localhost:5000/api/cart/remove", {
      user: user._id,
      productId,
    });
    await fetchCart();
  };

  // Cập nhật số lượng trên backend
  const updateQuantityOnServer = async (productId: string, quantity: number) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    await axios.post("http://localhost:5000/api/cart/update-quantity", {
      user: user._id,
      productId,
      quantity,
    });
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, setCartItems, removeItemFromCart, updateQuantityOnServer }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);