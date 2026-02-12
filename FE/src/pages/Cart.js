import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import styles from "../css/Cart.module.css";

function Cart() {
  // Lấy dữ liệu và action từ CartContext
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Lưu id sản phẩm đang bị xoá (phục vụ animation)
  const [removingItemId, setRemovingItemId] = useState(null);

  /**
   * Tính tổng tiền:
   * subtotal = tổng (giá sản phẩm × số lượng)
   * Ví dụ: 20.000₫ × 2 + 15.000₫ × 1 = 55.000₫
   */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  /**
   * Xử lý xoá sản phẩm:
   * - Set id để chạy animation
   * - Sau 300ms (khớp CSS) thì xoá thật khỏi cart
   */
  const handleRemove = (productId) => {
    setRemovingItemId(productId);

    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItemId(null);
    }, 300);
  };

  return (
    <>
      <Header />

      <main className={styles.cartPage}>
        <h1 className={styles.cartTitle}>Giỏ hàng của bạn</h1>

        <div className={styles.cartContainer}>
          {/* ===== DANH SÁCH SẢN PHẨM ===== */}
          <div className={styles.cartItems}>
            {cartItems.length === 0 ? (
              <p className={styles.emptyCart}>
                Chưa có sản phẩm nào trong giỏ hàng
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.cartItem} ${
                    removingItemId === item.product.id ? styles.removing : ""
                  }`}
                >
                  {/* Ảnh sản phẩm */}
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className={styles.itemImage}
                  />

                  <div className={styles.itemDetails}>
                    {/* Tên sản phẩm */}
                    <h3 className={styles.itemName}>{item.product.name}</h3>

                    {/* Giá 1 sản phẩm */}
                    <p className={styles.itemPrice}>
                      Giá:{" "}
                      <strong>{item.product.price.toLocaleString()}₫</strong> /
                      sản phẩm
                    </p>

                    {/* Điều chỉnh số lượng */}
                    <div className={styles.quantityControl}>
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        title="Giảm số lượng"
                      >
                        −
                      </button>

                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        title="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    {/* Tổng tiền cho sản phẩm này */}
                    <p className={styles.itemTotal}>
                      Thành tiền:{" "}
                      <strong>
                        {(item.product.price * item.quantity).toLocaleString()}₫
                      </strong>
                    </p>

                    {/* Nút xoá sản phẩm */}
                    <button
                      className={styles.removeBtn}
                      onClick={() => {
                        const ok = window.confirm(
                          `Bạn có chắc muốn xoá "${item.product.name}" khỏi giỏ hàng?`,
                        );
                        if (ok) handleRemove(item.product.id);
                      }}
                    >
                      ✕ Xoá sản phẩm
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ===== TỔNG ĐƠN HÀNG ===== */}
          <div className={styles.cartSummary}>
            <h3>Thông tin đơn hàng</h3>

            <div className={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Tổng cộng</span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>

            <p className={styles.summaryNote}>
              * Giá đã bao gồm VAT, chưa bao gồm ưu đãi (nếu có)
            </p>

            <button
              className={styles.checkoutBtn}
              disabled={cartItems.length === 0}
              onClick={() => {
                window.location.href = "/checkout";
              }}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;
