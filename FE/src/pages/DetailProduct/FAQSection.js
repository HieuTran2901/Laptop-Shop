import styles from "../../css/DetailProduct/FAQ.module.css";
import { useState } from "react";

function FAQSection() {
  const [activeFaq, setActiveFaq] = useState(null); // null = đóng hết, số = mở item đó

  return (
    <section className={styles.tabSection}>
      <h2>Câu hỏi thường gặp</h2>

      <div className={styles.faqList}>
        <div className={styles.faqItem}>
          <button
            className={`${styles.faqQuestion} ${activeFaq === 0 ? styles.active : ""}`}
            onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
          >
            Máy có nâng cấp RAM được không?
            <span className={styles.faqIcon}>
              {activeFaq === 0 ? "−" : "+"}
            </span>
          </button>

          <div
            className={`${styles.faqAnswer} ${activeFaq === 0 ? styles.open : ""}`}
          >
            <p>
              RAM được hàn chết trực tiếp trên bo mạch chủ (LPDDR5x) nên{" "}
              <strong>không thể nâng cấp</strong>.<br />
              Tuy nhiên SSD hoàn toàn có thể tháo rời và nâng cấp dung lượng dễ
              dàng.
            </p>
          </div>
        </div>

        <div className={styles.faqItem}>
          <button
            className={`${styles.faqQuestion} ${activeFaq === 1 ? styles.active : ""}`}
            onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
          >
            Thời lượng pin thực tế sử dụng được bao lâu?
            <span className={styles.faqIcon}>
              {activeFaq === 1 ? "−" : "+"}
            </span>
          </button>

          <div
            className={`${styles.faqAnswer} ${activeFaq === 1 ? styles.open : ""}`}
          >
            <p>Tùy theo tác vụ sử dụng:</p>
            <ul>
              <li>
                Lướt web, xem tài liệu, làm việc văn phòng nhẹ →{" "}
                <strong>15–18 giờ</strong>
              </li>
              <li>
                Xem video full HD → <strong>khoảng 18 giờ</strong>
              </li>
              <li>
                Làm việc nặng (code nhiều tab, chỉnh sửa ảnh/video nhẹ) →{" "}
                <strong>10–13 giờ</strong>
              </li>
            </ul>
            <p>
              Sạc nhanh: từ 5% → 80% chỉ trong khoảng <strong>60 phút</strong>.
            </p>
          </div>
        </div>

        <div className={styles.faqItem}>
          <button
            className={`${styles.faqQuestion} ${activeFaq === 2 ? styles.active : ""}`}
            onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
          >
            Máy có hỗ trợ bút Surface Pen không?
            <span className={styles.faqIcon}>
              {activeFaq === 2 ? "−" : "+"}
            </span>
          </button>

          <div
            className={`${styles.faqAnswer} ${activeFaq === 2 ? styles.open : ""}`}
          >
            <p>
              Có hỗ trợ rất tốt <strong>Surface Slim Pen 2</strong> (mua riêng).
              <br />
              Bút có độ nhạy áp lực cao, hỗ trợ ghi chú, vẽ, chỉnh sửa trực tiếp
              trên màn hình cảm ứng cực kỳ mượt.
            </p>
          </div>
        </div>

        {/* Có thể thêm nhiều câu hỏi nữa */}
      </div>
    </section>
  );
}

export default FAQSection;
