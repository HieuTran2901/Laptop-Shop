import { useRef, useState } from "react";
import "../css/Header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import laptopCategories from "./HeaderComponent/DropdownMenu";
import { useCart } from "../context/CartContext";

const Header = () => {
  // State for menu and dropdown
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  // Ref for search input
  const inputRef = useRef();
  const { cartCount, cartItems, removeFromCart, updateQuantity } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">TECHNOLAP</span>
          <span className="logo-sub">Laptop & Công nghệ</span>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setOpenMenu(!openMenu)}>
          <i className="fas fa-bars"></i>
        </div>

        {/* Menu */}
        <nav className={`menu ${openMenu ? "active" : ""}`}>
          <a href="/">Trang chủ</a>

          {/* Dropdown */}
          <div className={`dropdown ${openDropdown ? "open" : ""}`}>
            <span
              className="dropdown-title"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              Danh mục laptop <i className="fas fa-chevron-down"></i>
            </span>

            <div className={`dropdown-content ${openDropdown ? "show" : ""}`}>
              {laptopCategories.map((category, index) => (
                <a key={index} href={category.link}>
                  <i className={category.icon}></i> {category.name}
                </a>
              ))}
            </div>
          </div>

          <a href="/products">Sản phẩm </a>
          <a href="/admin">Quản trị</a>
        </nav>

        {/* Search */}
        <div className="search-box">
          <input
            placeholder="Tìm laptop, phụ kiện, thương hiệu..."
            ref={inputRef}
          />

          <span
            className="clear-search"
            onClick={() => {
              inputRef.current.value = "";
              inputRef.current.focus();
            }}
          >
            <i className="fas fa-times"></i>
          </span>

          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Cart */}
        <div className="cart" onClick={() => setOpenCart(!openCart)}>
          <i className="fas fa-shopping-cart"></i>

          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}

          {/* Mini Cart */}
          {openCart && (
            <div className="mini-cart" onClick={(e) => e.stopPropagation}>
              <h4>Giỏ hàng</h4>

              {cartItems.length === 0 ? (
                <p className="empty-cart">Chưa có sản phẩm</p>
              ) : (
                <>
                  <ul
                    className="mini-cart-list"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cartItems.map((item) => (
                      <li key={item.id} className="mini-cart-item">
                        <img src={item.product.images[0]} alt={item.name} />

                        <div className="item-info">
                          <p className="item-name">{item.product.name}</p>
                          {/* Quantity control */}
                          <div className="quantity-control">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                );
                              }}
                              disabled={item.quantity <= 1} // Disable button nếu số lượng <= 1
                            >
                              -
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                          <p className="item-price">
                            {item.price.toLocaleString()}₫ × {item.quantity}
                          </p>
                        </div>

                        {/* Nút xoá */}
                        <button
                          className="remove-item"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                            const ok = window.confirm(
                              `Bạn có chắc muốn xoá ${item.product.name} khỏi giỏ hàng?`,
                            );
                            if (ok) removeFromCart(item.product.id);
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  {/* Total */}
                  <div className="mini-cart-total">
                    <span className="total-txt">Tổng cộng</span>
                    <span className="total-price">
                      {cartItems
                        .reduce(
                          (sum, item) =>
                            sum + item.product.price * item.quantity,
                          0,
                        )
                        .toLocaleString()}
                      ₫
                    </span>
                  </div>

                  <a href="/cart" className="view-cart-btn">
                    Xem giỏ hàng
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
