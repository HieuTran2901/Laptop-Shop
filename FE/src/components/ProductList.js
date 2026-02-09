import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import QuickView from "./ProductListComponent";
import "../css/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="product-page">
      <h1 className="title">💻 Laptop Shop</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="product-card">
              {/* Discount */}
              <div className="discount-badge">
                -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
              </div>

              {/* Wishlist */}
              <div className="wishlist">
                <i className="far fa-heart"></i>
              </div>

              {/* Image */}
              <div className="product-image-wrap">
                <img
                  src={
                    p.images && p.images.length > 0
                      ? p.images[0]
                      : "https://surfaceviet.vn/wp-content/uploads/2024/03/Surface-Laptop-6-Platinum.png"
                  }
                  alt={p.name}
                  className="product-image"
                />

                {/* Hover actions */}
                <div className="image-overlay">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="overlay-btn"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-brand">{p.brand}</p>

                {/* Rating */}
                <div className="rating">
                  ⭐⭐⭐⭐☆ <span>(4.5)</span>
                </div>

                {/* Price */}
                <div className="price-box">
                  {/* <span className="price">{p.price}đ</span> */}

                  {/* Use Intl.NumberFormat to format price */}
                  <span className="price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.price)}
                  </span>

                  <span className="old-price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.oldPrice)}
                  </span>
                </div>

                <p className="product-code">{p.code}</p>
              </div>

              {/* Actions */}
              <div className="product-actions">
                <button className="button button-add">
                  <i className="fas fa-cart-plus"></i> Add
                </button>
                <button className="button button-details">Details</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products found.
          </p>
        )}
      </div>
      {selectedProduct && (
        <QuickView
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
}

export default ProductList;
