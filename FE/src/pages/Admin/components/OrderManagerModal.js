import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, confirmOrder } from "../../../services/orderService";
import styles from "./css/OrderManagerModal.module.css";
import Pagination from "../../../components/Pagination";

function OrderManagerModal() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [orderPage, setOrderPage] = useState(1);
  const [totalOrderPages, setTotalOrderPages] = useState(1);

  useEffect(() => {
    fetchOrders(orderPage);
  }, [orderPage]);

  const fetchOrders = async (page) => {
    setLoadingOrders(true);
    try {
      const res = await getAllOrders({
        page: page - 1, // backend 0-index
        size: 8,
      });

      setOrders(res.data.content || []);
      setTotalOrderPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleConfirmOrder = async (orderCode) => {
    if (window.confirm(`Xác nhận đơn hàng #${orderCode} không?`)) {
      try {
        await confirmOrder(orderCode);

        setOrders((prev) =>
          prev.map((o) =>
            o.orderCode === orderCode ? { ...o, status: "CONFIRMED" } : o,
          ),
        );
      } catch (err) {
        alert("Xác nhận đơn hàng thất bại!");
      }
    }
  };

  const formatCurrency = (amount) =>
    amount
      ? amount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "—";

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "—";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Quản lý đơn hàng</div>

      {loadingOrders ? (
        <div className={styles.empty}>Đang tải đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>Chưa có đơn hàng nào</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderCode}>
                  <td>#{order.orderCode}</td>
                  <td>
                    {order.customerName || order.user?.name || "Khách vãng lai"}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className={styles.price}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[order.status?.toLowerCase()]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {order.status === "PENDING" && (
                        <button
                          className={`${styles.btn} ${styles.btnConfirm}`}
                          onClick={() => handleConfirmOrder(order.orderCode)}
                        >
                          Xác nhận
                        </button>
                      )}

                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() =>
                          navigate(`/admin/orders/${order.orderCode}`)
                        }
                      >
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={orderPage}
            totalPages={totalOrderPages}
            onPageChange={setOrderPage}
          />
        </div>
      )}
    </div>
  );
}

export default OrderManagerModal;
