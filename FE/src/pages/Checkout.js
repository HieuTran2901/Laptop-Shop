import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import styles from "../css/Checkout.module.css";
import { createPayment } from "../services/paymentService";
import { createOrder } from "../services/orderService";

function Checkout() {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingFee = 30000; // Phí ship mặc định
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Chỉ gửi những thứ cần thiết trong cartItems để tạo order
  const cleanCartItems = cartItems.map((item) => ({
    product: { id: item.product.id },
    quantity: item.quantity,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "cod") {
      // Xử lý đặt hàng COD
      const res = await createOrder({
        ...formData,
        items: cleanCartItems,
        paymentMethod: "COD",
      });

      if (res.data) {
        alert("Đặt hàng thành công! Shipper sẽ liên hệ bạn sớm.");
        window.location.href = "/"; // Chuyển hướng về trang chủ
      }
    } else if (formData.paymentMethod === "bank") {
      // Tạo order trước khi thanh toán để lấy orderId
      const orderRes = await createOrder({
        ...formData,
        items: cleanCartItems,
        paymentMethod: "BANK",
      });

      if (!orderRes.data) {
        alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      const orderId = orderRes.data.orderCode;
      const totalAmount = orderRes.data.totalAmount;
      // console.log(orderRes.data);

      // Tạo payment với orderId
      const res = await createPayment({
        amount: totalAmount,
        orderId: orderId,
      });

      if (res.data?.payUrl) {
        window.location.href = res.data.payUrl; // Chuyển hướng đến trang thanh toán MoMo
      } else {
        alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      <Header />
      <main className={styles.checkoutPage}>
        <div className={styles.container}>
          <form className={styles.checkoutForm} onSubmit={handleSubmit}>
            {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Họ và tên"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  required
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (không bắt buộc)"
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  name="note"
                  placeholder="Ghi chú đơn hàng (ví dụ: giao giờ hành chính)"
                  rows="3"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <h2 className={styles.sectionTitle} style={{ marginTop: "30px" }}>
                Phương thức thanh toán
              </h2>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  <span className={styles.radioCustom}></span>
                  <div className={styles.paymentText}>
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <p>
                      Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng.
                    </p>
                  </div>
                </label>

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === "bank"}
                    onChange={handleInputChange}
                  />
                  <span className={styles.radioCustom}></span>
                  <div className={styles.paymentText}>
                    <strong>Chuyển khoản ngân hàng</strong>
                    <p>Chuyển khoản qua QR Code hoặc STK ngân hàng.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className={styles.summarySection}>
              <h2 className={styles.sectionTitle}>Đơn hàng của bạn</h2>

              <div className={styles.orderItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemImgWrapper}>
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                      />
                      <span className={styles.itemQuantity}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.product.name}</p>
                    </div>
                    <p className={styles.itemPrice}>
                      {(item.product.price * item.quantity).toLocaleString()}₫
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.divider}></div>

              <div className={styles.calcRow}>
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>
              <div className={styles.calcRow}>
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
              </div>

              <div className={`${styles.calcRow} ${styles.totalRow}`}>
                <span>Tổng cộng</span>
                <span className={styles.totalPrice}>
                  {total.toLocaleString()}₫
                </span>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Đặt hàng ngay
              </button>

              <p className={styles.secureNote}>
                🔒 Thông tin của bạn được bảo mật tuyệt đối
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Checkout;
