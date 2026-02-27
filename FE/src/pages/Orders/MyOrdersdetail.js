import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails, cancelOrder } from "../../services/orderService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CancelModal from "./components/CancelModal";
import styles from "../../css/Orders/MyOrdersDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruck,
  faBox,
  faTimesCircle,
  faInfoCircle,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

function MyOrdersDetail() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // State cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetails(orderCode);
        setOrder(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderCode]);

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const STATUS_STEPS = [
    {
      key: "PENDING",
      label: "Chờ xác nhận",
      icon: faInfoCircle,
      color: "#f59e0b",
    },
    {
      key: "CONFIRMED",
      label: "Đã xác nhận",
      icon: faCheckCircle,
      color: "#3b82f6",
    },
    { key: "SHIPPED", label: "Đang giao", icon: faTruck, color: "#8b5cf6" },
    { key: "DELIVERED", label: "Đã giao", icon: faBox, color: "#10b981" },
    {
      key: "CANCELLED",
      label: "Đã hủy",
      icon: faTimesCircle,
      color: "#ef4444",
    },
  ];

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return STATUS_STEPS.findIndex((step) => step.key === order.status);
  };

  const currentIndex = getCurrentStepIndex();

  //
  const progressPercent =
    currentIndex > 0 ? (currentIndex / (STATUS_STEPS.length - 1)) * 100 : 0;

  const handleCancelOrder = async () => {
    setShowCancelModal(false); // Đóng modal trước khi gọi API
    setCancelLoading(true);
    try {
      await cancelOrder(orderCode);
      alert("Đơn hàng đã được hủy thành công.");
      navigate("/my-orders");
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>Đang tải chi tiết đơn hàng...</div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className={styles.notFound}>
          <h2>Không tìm thấy đơn hàng</h2>
          <button onClick={() => navigate("/my-orders")}>
            Quay lại đơn hàng của tôi
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className={styles.orderDetailPage}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Chi tiết đơn hàng #{orderCode}</h1>
            <div className={styles.orderCodeBox}>
              <span>
                Mã đơn hàng: <strong>{orderCode}</strong>
              </span>
              <button onClick={copyOrderCode} className={styles.copyBtn}>
                <FontAwesomeIcon icon={faCopy} />
                {copied ? "Đã sao chép!" : "Sao chép"}
              </button>
            </div>
          </div>

          {/* Timeline trạng thái */}
          <div
            className={styles.statusTimeline}
            // -- is a CSS variable used in the styles to set the width of the progress bar
            style={{ "--progress": progressPercent }}
          >
            {STATUS_STEPS.map((step, index) => (
              <div
                key={step.key}
                className={`${styles.timelineStep} ${index <= getCurrentStepIndex() ? styles.active : ""} ${
                  index === getCurrentStepIndex() ? styles.current : ""
                }`}
              >
                <div
                  className={styles.iconCircle}
                  style={{ borderColor: step.color }}
                >
                  <FontAwesomeIcon
                    icon={step.icon}
                    style={{ color: step.color }}
                  />
                </div>
                <p className={styles.stepLabel}>{step.label}</p>

                {/* Connector chỉ render giữa các bước, không phải trong bước cuối */}
                {index < STATUS_STEPS.length - 1 && (
                  <div
                    className={`${styles.connector} ${
                      index < getCurrentStepIndex() ? styles.completed : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Thông tin đơn hàng */}
          <div className={styles.grid}>
            {/* Thông tin đơn hàng */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Thông tin đơn hàng</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span>Trạng thái:</span>
                  <strong
                    style={{
                      color: STATUS_STEPS.find((s) => s.key === order.status)
                        ?.color,
                    }}
                  >
                    {STATUS_STEPS.find((s) => s.key === order.status)?.label ||
                      order.status}
                  </strong>
                </div>
                <div className={styles.infoItem}>
                  <span>Ngày đặt:</span>
                  <strong>{formatDate(order.createdAt)}</strong>
                </div>
                {order.confirmedAt && (
                  <div className={styles.infoItem}>
                    <span>Ngày xác nhận:</span>
                    <strong>{formatDate(order.confirmedAt)}</strong>
                  </div>
                )}
                {order.shippedAt && (
                  <div className={styles.infoItem}>
                    <span>Ngày giao hàng:</span>
                    <strong>{formatDate(order.shippedAt)}</strong>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span>Phương thức thanh toán:</span>
                  <strong>
                    {order.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Chuyển khoản / MoMo / VNPay"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Địa chỉ giao hàng</h3>
              <div className={styles.address}>
                <p className={styles.name}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.ward},{" "}
                  {order.shippingAddress?.district},{" "}
                  {order.shippingAddress?.province}
                </p>
                {order.shippingAddress?.note && (
                  <p className={styles.note}>
                    <strong>Ghi chú:</strong> {order.shippingAddress.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Sản phẩm trong đơn hàng</h3>
            <div className={styles.productTable}>
              <div className={styles.tableHeader}>
                <div>Sản phẩm</div>
                <div>Đơn giá</div>
                <div>Số lượng</div>
                <div>Thành tiền</div>
              </div>

              {order.items?.map((item) => (
                <div key={item.id} className={styles.tableRow}>
                  <div className={styles.productCell}>
                    <img
                      src={
                        item.product.images?.[0] || "/placeholder-product.jpg"
                      }
                      alt={item.productName}
                      className={styles.productImg}
                    />
                    <div>
                      <p className={styles.productName}>{item.productName}</p>
                      {item.variant && (
                        <p className={styles.variant}>{item.variant}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div>{item.quantity}</div>
                  <div className={styles.totalCell}>
                    {(item.price * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng kết tiền */}
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <span>
                  {order.subTotal?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span>
                  {order.shippingFee > 0
                    ? order.shippingFee.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "Miễn phí"}
                </span>
              </div>
              {order.discount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Giảm giá:</span>
                  <span className={styles.discount}>
                    -
                    {order.discount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              )}
              <div className={styles.summaryRowTotal}>
                <span>Tổng thanh toán:</span>
                <strong>
                  {order.totalAmount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </strong>
              </div>
            </div>
          </div>

          {/* Hành động */}
          <div className={styles.actionButtons}>
            {order.status === "SHIPPED" && order.trackingCode && (
              <button className={styles.trackBtn}>
                Theo dõi vận đơn ({order.trackingCode})
              </button>
            )}
            {order.status === "PENDING" && (
              <button
                className={styles.cancelOrderBtn}
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
              >
                {cancelLoading ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
            )}
            {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
              <button className={styles.rebuyBtn}>Mua lại</button>
            )}
            <button className={styles.supportBtn}>Liên hệ hỗ trợ</button>
          </div>
        </div>

        {/* Modal hủy đơn */}
        {showCancelModal && (
          <CancelModal
            orderCode={orderCode}
            setShowCancelModal={setShowCancelModal}
            handleCancelOrder={handleCancelOrder}
            cancelLoading={cancelLoading}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

export default MyOrdersDetail;
