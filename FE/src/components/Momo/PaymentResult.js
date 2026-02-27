import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import Header from "../Header";
import Footer from "../Footer";
import styles from "../../css/Momo/PaymentResult.module.css";

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const resultCode = query.get("resultCode");
    const orderIdFromUrl = query.get("orderId");
    const message = query.get("message") || "";

    setOrderId(orderIdFromUrl || "");

    if (resultCode === "0") {
      setStatus("success");
      // Bắn confetti khi thành công
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > animationEnd) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#2563eb", "#22c55e", "#facc15", "#ef4444", "#a855f7"],
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#2563eb", "#22c55e", "#facc15", "#ef4444", "#a855f7"],
        });
      }, 250);

      // Confetti giữa màn hình
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setStatus("failed");
      setErrorMessage(
        message ||
          "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.",
      );
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        {status === "loading" && (
          <div className={styles.card}>
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
              <h2>Đang xử lý thanh toán</h2>
              <p>Vui lòng không thoát trang trong giây lát...</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className={`${styles.card} ${styles.successCard}`}>
            <img
              src="https://cdn.dribbble.com/userupload/15097591/file/still-1563b1c5a9ed7f09f09e48b2c8bb2606.gif"
              alt="Thanh toán thành công"
              className={styles.animatedIcon}
            />
            <h2>Thanh toán thành công!</h2>
            {orderId && (
              <div className={styles.orderInfo}>
                Mã đơn hàng: <span className={styles.orderId}>{orderId}</span>
              </div>
            )}
            <p className={styles.message}>
              Cảm ơn bạn đã mua sắm! Đơn hàng đang được xử lý ngay.
            </p>
            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => navigate("/orders")}
              >
                Xem đơn hàng
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className={`${styles.card} ${styles.failedCard}`}>
            <img
              src="https://thuthuatnhanh.com/wp-content/uploads/2020/04/tao-anh-gif-online.gif"
              alt="Thanh toán thất bại"
              className={styles.animatedIcon}
            />
            <h2>Thanh toán thất bại</h2>
            <p className={styles.message}>
              {errorMessage || "Vui lòng thử lại hoặc chọn phương thức khác."}
            </p>
            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => navigate("/checkout")}
              >
                Thử lại thanh toán
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PaymentResult;
