import { useState } from "react";
import styles from "../../css/Admin.module.css";
import { AddProduct, OrderManagerModal } from "./components";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.adminTitle}>Trang Quản Trị - Laptop</div>

      {/* Tabs */}
      <div className={styles.adminTabs}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "products" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("products")}
        >
          Quản lý sản phẩm
        </button>

        <button
          className={`${styles.tabBtn} ${
            activeTab === "orders" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Quản lý đơn hàng
        </button>
      </div>

      {activeTab === "products" && <AddProduct />}
      {activeTab === "orders" && <OrderManagerModal />}
    </div>
  );
}

export default AdminPage;
