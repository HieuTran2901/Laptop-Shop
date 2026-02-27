import { useState } from "react";
import styles from "../../css/ProductList/Filter.module.css";

const Filter = ({ onClose, onApply }) => {
  const [selected, setSelected] = useState({
    brand: [],
    price: [],
    category: [],
    cpu: [],
    ram: [],
    storage: [],
  });

  const toggleSelect = (type, value) => {
    setSelected((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const removeItem = (type, value) => {
    setSelected((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  const clearAll = () => {
    const empty = {};
    Object.keys(selected).forEach((key) => (empty[key] = []));
    setSelected(empty);
  };

  const renderOptions = (type, options, suffix = "") => (
    <div className={styles.optionGrid}>
      {options.map((item) => (
        <button
          key={item}
          className={`${styles.optionBtn} ${
            selected[type].includes(item) ? styles.active : ""
          }`}
          onClick={() => toggleSelect(type, item)}
        >
          {item}
          {suffix}
        </button>
      ))}
    </div>
  );

  // 🔥 Gom tất cả filter đã chọn thành 1 mảng
  // flatMAp dùng để làm phẳng mảng sau khi map, vì mỗi type sẽ trả về 1 mảng các item đã chọn
  // Ví dụ: { brand: ["HP", "ASUS"], price: ["Dưới 10 triệu"] } sẽ được chuyển thành [{type: "brand", value: "HP"}, {type: "brand", value: "ASUS"}, {type: "price", value: "Dưới 10 triệu"}]
  // entries sẽ trả về mảng các cặp [key, value] của object selected, sau đó map để tạo thành mảng các item đã chọn với type và value
  const selectedItems = Object.entries(selected).flatMap(([type, values]) =>
    values.map((value) => ({
      type,
      value,
    })),
  );

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Tất cả bộ lọc</h2>
          <button onClick={onClose}>× Đóng</button>
        </div>

        <div className={styles.body}>
          {/* 🔥 Selected Filters */}
          {selectedItems.length > 0 && (
            <div className={styles.selectedWrapper}>
              <h4>Đã chọn:</h4>
              <div className={styles.selectedList}>
                {selectedItems.map((item, index) => (
                  <div key={index} className={styles.selectedTag}>
                    {item.value}
                    <span onClick={() => removeItem(item.type, item.value)}>
                      ×
                    </span>
                  </div>
                ))}
                <button className={styles.clearAllSmall} onClick={clearAll}>
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}

          {/* BRAND */}
          <div className={styles.section}>
            <h3>Hãng</h3>
            {renderOptions("brand", [
              "HP",
              "ASUS",
              "Acer",
              "Lenovo",
              "Dell",
              "MSI",
              "MacBook",
            ])}
          </div>

          {/* PRICE */}
          <div className={styles.section}>
            <h3>Giá</h3>
            {renderOptions("price", [
              "Dưới 10 triệu",
              "10 - 20 triệu",
              "20 - 30 triệu",
              "Trên 30 triệu",
            ])}
          </div>

          {/* CPU */}
          <div className={styles.section}>
            <h3>CPU</h3>
            {renderOptions("cpu", [
              "Intel i5",
              "Intel i7",
              "Ryzen 5",
              "Ryzen 7",
            ])}
          </div>

          {/* RAM */}
          <div className={styles.section}>
            <h3>RAM</h3>
            {renderOptions("ram", ["8", "16", "32"], "GB")}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={clearAll}>
            Bỏ chọn
          </button>
          <button className={styles.applyBtn} onClick={handleApply}>
            Xem kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
