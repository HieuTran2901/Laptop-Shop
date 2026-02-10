import { createContext, useContext, useEffect, useState } from "react";
import * as cartService from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("token"),
  ); // Kiểm tra token để xác định trạng thái đăng nhập

  const fetchCart = async () => {
    try {
      const res = await cartService.getCartItems();

      setCartItems(res.data.items || []); // Đảm bảo luôn có mảng, tránh lỗi khi res.data là null
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeCartItem(productId);
      fetchCart(); // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) return;
      await cartService.updateCartItem(productId, quantity);
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  // fetch giỏ hàng khi component CartProvider được mount hoặc khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (authenticated) {
      fetchCart();
    } else {
      setCartItems([]); // Xoá giỏ hàng khi người dùng đăng xuất
    }
  }, [authenticated]); // Theo dõi sự thay đổi của token trong localStorage

  const addToCart = async (productId, quantity) => {
    await cartService.addToCart(productId, quantity);
    fetchCart(); // Cập nhật lại giỏ hàng sau khi thêm sản phẩm
  };

  // reduce để tính tổng số lượng sản phẩm trong giỏ hàng, bắt đầu từ 0 và cộng dồn số lượng của từng item
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        cartCount,
        removeFromCart,
        updateQuantity,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
