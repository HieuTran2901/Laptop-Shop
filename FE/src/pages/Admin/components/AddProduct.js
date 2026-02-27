import { useState, useEffect } from "react";
import { ProductForm, UpdateProduct } from "../../../components/Admin";
import { getProducts, deleteProduct } from "../../../services/productService";
import Pagination from "../../../components/Pagination";
import styles from "./css/AddProduct.module.css";

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch khi page thay đổi
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page) => {
    setLoadingProducts(true);
    try {
      const res = await getProducts({
        page: page,
        size: 8,
      });

      setProducts(res.data.items || []);
      setTotalPages(res.data.totalPage || 1);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts(page); // reload lại trang hiện tại
  };

  const handleProductUpdated = () => {
    setEditingProductId(null);
    fetchProducts(page);
  };

  const handleProductDeleted = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        fetchProducts(page);
      } catch (err) {
        alert("Xóa sản phẩm thất bại!");
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount
      ? amount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "—";
  };

  return (
    <>
      {/* FORM */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          {editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </div>

        {editingProductId ? (
          <UpdateProduct
            productId={editingProductId}
            onProductUpdated={handleProductUpdated}
          />
        ) : (
          <ProductForm onProductAdded={handleProductAdded} />
        )}
      </div>

      {/* LIST */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Danh sách sản phẩm</div>

        {loadingProducts ? (
          <div className={styles.empty}>Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>Chưa có sản phẩm nào</div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Tên laptop</th>
                    <th>Ảnh</th>
                    <th>Hãng</th>
                    <th>Giá cũ</th>
                    <th>Giá mới</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>
                        <img
                          src={
                            p.images?.[0] ||
                            "https://surfaceviet.vn/wp-content/uploads/2024/03/Surface-Laptop-6-Platinum.png"
                          }
                          alt={p.name}
                          className={styles.productImg}
                        />
                      </td>
                      <td>{p.brand || "—"}</td>
                      <td className={styles.oldPrice}>
                        {formatCurrency(p.oldPrice)}
                      </td>
                      <td className={styles.price}>
                        {formatCurrency(p.price)}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.btn} ${styles.btnEdit}`}
                            onClick={() => setEditingProductId(p.id)}
                          >
                            Sửa
                          </button>
                          <button
                            className={`${styles.btn} ${styles.btnDelete}`}
                            onClick={() => handleProductDeleted(p.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}

export default AddProduct;
