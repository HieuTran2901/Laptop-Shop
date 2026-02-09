import { Link } from "react-router-dom";
import styles from "../css/Alert.module.css";
import authImg from "../assets/alert.jpg";

function Alert({ setShowLoginAlert }) {
  return (
    <div className={styles.overlay} onClick={() => setShowLoginAlert(false)}>
      <div className={styles.alert} onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button
          className={styles.closeBtn}
          onClick={() => setShowLoginAlert(false)}
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* IMAGE */}
        <div className={styles.imageWrapper}>
          <img src={authImg} alt="Login required" />
        </div>

        {/* CONTENT */}
        <h3 className={styles.title}>Yêu cầu đăng nhập</h3>

        <p className={styles.message}>
          Vui lòng đăng nhập hoặc tạo tài khoản để sử dụng chức năng này.
        </p>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <Link to="/login" className={styles.btnPrimary}>
            Đăng nhập
          </Link>

          <Link to="/register" className={styles.btnSecondary}>
            Đăng ký
          </Link>
        </div>

        <div className={styles.security}>🔒 Bảo mật thông tin tuyệt đối</div>
      </div>
    </div>
  );
}

export default Alert;
