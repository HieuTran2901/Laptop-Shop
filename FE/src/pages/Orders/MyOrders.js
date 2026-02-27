import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../css/Orders/MyOrders.module.css";
import { getUserOrders, cancelOrder } from "../../services/orderService";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import CancelModal from "./components/CancelModal";

// Trạng thái đơn hàng (có thể tùy chỉnh theo backend của bạn)
const STATUS_STEPS = {
  PENDING: { label: "Chờ xác nhận", color: "#f59e0b" },
  CONFIRMED: { label: "Đã xác nhận", color: "#3b82f6" },
  SHIPPED: { label: "Đang giao", color: "#8b5cf6" },
  DELIVERED: { label: "Đã giao", color: "#10b981" },
  CANCELLED: { label: "Đã hủy", color: "#ef4444" },
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState(null);

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      await cancelOrder(selectedOrderCode);
      setOrders((prev) =>
        prev.map((order) =>
          order.orderCode === selectedOrderCode
            ? { ...order, status: "CANCELLED" }
            : order,
        ),
      );
      setShowCancelModal(false);
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders({ page, size: 5 });
        setOrders(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>Đang tải đơn hàng...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className={styles.ordersPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Đơn hàng của tôi</h1>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Bạn chưa có đơn hàng nào.</p>
              <button
                onClick={() => (window.location.href = "/")}
                className={styles.shopNowBtn}
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.orderCode} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3 className={styles.orderCode}>
                        Mã đơn: {order.orderCode}
                      </h3>
                      <p className={styles.orderDate}>
                        Đặt ngày: {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div
                      className={styles.statusBadge}
                      style={{
                        backgroundColor:
                          STATUS_STEPS[order.status]?.color + "22",
                        color: STATUS_STEPS[order.status]?.color,
                      }}
                    >
                      {STATUS_STEPS[order.status]?.label || order.status}
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    <div className={styles.orderSummary}>
                      <p>
                        <strong>Số lượng sản phẩm:</strong>{" "}
                        {/* {order.quantity || "—"} */}
                        {order.items && order.items.length > 0
                          ? order.items.reduce(
                              (total, item) => total + (item.quantity || 0),
                              0,
                            )
                          : "—"}
                      </p>
                      <p>
                        <strong>Thanh toán:</strong>{" "}
                        {order.paymentMethod === "COD"
                          ? "Khi nhận hàng"
                          : "Chuyển khoản / MoMo"}
                      </p>
                      <p className={styles.totalAmount}>
                        <strong>Tổng tiền:</strong>{" "}
                        {/* {order.totalAmount.toLocaleString()}₫ */}
                        {order.totalAmount != null
                          ? order.totalAmount.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "—"}
                      </p>
                    </div>

                    <div className={styles.orderActions}>
                      <button
                        onClick={() =>
                          navigate(`/my-orders/${order.orderCode}`)
                        }
                        className={styles.detailBtn}
                      >
                        Xem chi tiết
                      </button>
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => {
                            setSelectedOrderCode(order.orderCode);
                            setShowCancelModal(true);
                          }}
                          className={styles.cancelBtn}
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showCancelModal && (
          <CancelModal
            orderCode={selectedOrderCode}
            setShowCancelModal={setShowCancelModal}
            handleCancelOrder={handleCancelOrder}
            cancelLoading={cancelLoading}
          />
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <Footer />
    </>
  );
}

export default MyOrders;
