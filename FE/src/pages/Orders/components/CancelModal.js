import styles from "./css/CancelModal.module.css";

function CancelModal({
  orderCode,
  setShowCancelModal,
  handleCancelOrder,
  cancelLoading,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Xác nhận hủy đơn hàng</h3>
        <p className={styles.modalText}>
          Bạn có chắc chắn muốn hủy đơn hàng <strong>#{orderCode}</strong>{" "}
          không?
          <br />
          Hành động này không thể hoàn tác.
        </p>
        <div className={styles.modalActions}>
          <button
            className={styles.modalCancelBtn}
            onClick={() => setShowCancelModal(false)}
            disabled={cancelLoading}
          >
            Không, giữ nguyên
          </button>
          <button
            className={styles.modalConfirmBtn}
            onClick={handleCancelOrder}
            disabled={cancelLoading}
          >
            {cancelLoading ? "Đang xử lý..." : "Có, hủy đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
