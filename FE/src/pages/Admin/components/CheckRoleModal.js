import styles from "./css/CheckRoleModal.module.css";
import { Link } from "react-router-dom";

function CheckRoleModal() {
  return (
    <div className={styles.accessDeniedContainer}>
      <div className={styles.accessDeniedCard}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.deniedIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h2 className={styles.accessDeniedTitle}>Truy cập bị từ chối</h2>

        <p className={styles.accessDeniedMessage}>
          Bạn không có quyền truy cập vào khu vực quản trị.
          <br />
          Vui lòng đăng nhập bằng tài khoản có quyền{" "}
          <span className={styles.highlight}>ADMIN</span>.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/login" className={styles.primaryButton}>
            Đăng nhập lại
          </Link>

          <Link to="/" className={styles.secondaryButton}>
            Về trang chủ
          </Link>
        </div>

        <p className={styles.footerText}>
          Nếu bạn tin rằng đây là lỗi hệ thống, vui lòng liên hệ quản trị viên.
        </p>
      </div>
    </div>
  );
}

export default CheckRoleModal;
