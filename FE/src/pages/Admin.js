import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import UpdateProduct from "../components/UpdateProduct";
import { getProducts, deleteProduct } from "../services/productService";
import "../css/Admin.css";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditingProductId(null);
  };

  const handleProductDeleted = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-title">Quản lý sản phẩm Laptop</div>

      {/* FORM */}
      <div className="card">
        <div className="card-header">
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
      <div className="card">
        <div className="card-header">Danh sách sản phẩm</div>

        {products.length === 0 ? (
          <div className="empty">Chưa có sản phẩm nào</div>
        ) : (
          <table className="product-table">
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
                        p.images && p.images.length > 0
                          ? p.images[0]
                          : "https://surfaceviet.vn/wp-content/uploads/2024/03/Surface-Laptop-6-Platinum.png"
                      }
                      alt={p.name}
                      style={{ width: "80px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{p.brand}</td>
                  <td className="old-price">${p.oldPrice}</td>
                  <td className="price">${p.price}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditingProductId(p.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleProductDeleted(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
