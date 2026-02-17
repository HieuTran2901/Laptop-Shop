import styles from "../../css/DetailProduct/SpecsSection.module.css";

function SpecsSection() {
  return (
    <>
      <section className={styles.tabSection}>
        <h2>Thông số nổi bật</h2>
        <div className={styles.highlightGrid}>
          <div className={styles.highlightItem}>
            <strong>CPU</strong>
            <span>Intel Core Ultra 7 165H + NPU AI Boost</span>
          </div>
          <div className={styles.highlightItem}>
            <strong>Màn hình</strong>
            <span>13.8" PixelSense 2304x1536, cảm ứng, 3:2</span>
          </div>
          <div className={styles.highlightItem}>
            <strong>RAM / SSD</strong>
            <span>16–64GB LPDDR5x / 512GB NVMe Gen4</span>
          </div>
          <div className={styles.highlightItem}>
            <strong>Pin</strong>
            <span>Lên đến 19 giờ, sạc nhanh 80% trong 60 phút</span>
          </div>
          <div className={styles.highlightItem}>
            <strong>Trọng lượng</strong>
            <span>~1.38 kg, nhôm nguyên khối</span>
          </div>
          <div className={styles.highlightItem}>
            <strong>Đặc trưng</strong>
            <span>Copilot key • Secured-core PC • Dolby Atmos</span>
          </div>
        </div>

        <p className={styles.shortDesc}>
          Surface Laptop 6 – laptop AI cao cấp với hiệu năng mạnh mẽ, pin cực
          trâu và thiết kế siêu mỏng nhẹ. Lý tưởng cho lập trình viên, doanh
          nhân và người làm sáng tạo nội dung.
        </p>
      </section>

      {/* 2. Ưu điểm nổi bật – dạng danh sách ngắn gọn, icon dẫn đầu */}
      <section className={styles.tabSection}>
        <h2>Ưu điểm nổi bật</h2>
        <ul className={styles.compactHighlightList}>
          <li>Thiết kế siêu mỏng nhẹ, sang trọng (chỉ 1.38kg)</li>
          <li>Màn hình 3:2 tỷ lệ vàng cho code & văn phòng</li>
          <li>Hiệu năng AI vượt trội nhờ Intel Core Ultra + NPU</li>
          <li>Pin lâu nhất phân khúc (18–19 giờ thực tế)</li>
          <li>Bàn phím êm, trackpad lớn, Copilot key tiện lợi</li>
          <li>Bảo mật cao cấp – Secured-core PC & Windows Hello</li>
        </ul>
      </section>

      {/*Thông số chi tiết */}
      <section className={styles.tabSection}>
        <h2>Thông số kỹ thuật chi tiết</h2>
        <table className={styles.specTable}>
          <tbody>
            <tr>
              <td>CPU</td>
              <td>Intel® Core™ Ultra 7 165H (hoặc Ultra 5) + NPU AI Boost</td>
            </tr>
            <tr>
              <td>Đồ họa</td>
              <td>Intel® Arc™ Graphics</td>
            </tr>
            <tr>
              <td>RAM</td>
              <td>16GB / 32GB / 64GB LPDDR5x</td>
            </tr>
            <tr>
              <td>Ổ cứng</td>
              <td>512GB SSD NVMe Gen4 (có thể nâng cấp)</td>
            </tr>
            <tr>
              <td>Màn hình</td>
              <td>13.8" PixelSense™ 2304×1536, cảm ứng, Dolby Vision IQ</td>
            </tr>
            <tr>
              <td>Pin & sạc</td>
              <td>Lên đến 19 giờ – sạc nhanh 80% trong 60 phút</td>
            </tr>
            <tr>
              <td>Trọng lượng / Kích thước</td>
              <td>~1.38kg – nhôm nguyên khối</td>
            </tr>
            <tr>
              <td>Cổng kết nối</td>
              <td>2× Thunderbolt 4, USB-A, Surface Connect</td>
            </tr>
            <tr>
              <td>Khác</td>
              <td>Camera 1080p AI • Bàn phím Alcantara • Dolby Atmos</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

export default SpecsSection;
