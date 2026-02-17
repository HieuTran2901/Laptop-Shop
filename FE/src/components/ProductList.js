import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import QuickView from "./ProductListComponent";
import Pagination from "./Pagination";
import styles from "../css/ProductList.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page) => {
    try {
      const res = await getProducts({ page, size: 8 });
      setProducts(res.data.items);
      setTotalPages(res.data.totalPage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.productPage}>
      <h1 className={styles.title}>Chọn theo tiêu chí</h1>

      <div className={styles.productGrid}>
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className={styles.productCard}>
              {/* Discount */}
              <div className={styles.discountBadge}>
                -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
              </div>

              {/* Wishlist */}
              <div className={styles.wishlist}>
                <i className="far fa-heart"></i>
              </div>

              {/* Image */}
              <div className={styles.productImageWrap}>
                <img
                  src={
                    p.images && p.images.length > 0
                      ? p.images[0]
                      : "https://surfaceviet.vn/wp-content/uploads/2024/03/Surface-Laptop-6-Platinum.png"
                  }
                  alt={p.name}
                  className={styles.productImage}
                />

                {/* Overlay */}
                <div className={styles.imageOverlay}>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className={styles.overlayBtn}
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className={styles.productInfo}>
                <span className={styles.productBrand}>
                  {p.brand.toUpperCase()}
                </span>
                <h3 className={styles.productName}>{p.name}</h3>

                {/* <div className={styles.brandRow}>
                  <span className={styles.stock}>
                    {p.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div> */}

                {/* Rating */}
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < Math.floor(p.rating) ? solidStar : regularStar}
                      className={styles.star}
                    />
                  ))}
                  <span className={styles.reviewCount}>
                    ({p.reviewCount || 0} reviews)
                  </span>
                </div>

                {/* Short Specs */}
                <div className={styles.specs}>
                  {p.specs &&
                    p.specs.split("\n").map((spec, index) => {
                      const parts = spec.split(":");
                      const key = parts[0]?.trim();
                      const value = parts[1]?.trim() || "";

                      return (
                        <span key={index}>
                          {key === "CPU" &&
                            (() => {
                              const words = value.split(" ");
                              return (
                                <>
                                  ⚡ {words[1]} {words[2]} {words[4]}{" "}
                                </>
                              );
                            })()}
                          {key === "RAM" && <>💾 {value.split(" ")[0]} RAM </>}
                          {(key === "SSD" || key === "Storage") && (
                            <>⚙️ {value.split(" ")[0]} SSD </>
                          )}
                          {key === "VGA" && <>🎮 {value.split(" ")[0]} VGA </>}
                        </span>
                      );
                    })}
                </div>

                {/* Price */}
                <div className={styles.priceBox}>
                  <span className={styles.price}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.price)}
                  </span>

                  <span className={styles.oldPrice}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.oldPrice)}
                  </span>
                </div>

                {/* Sold Progress */}
                {/* <div className={styles.soldBox}>
                  <div className={styles.soldText}>Sold: 68</div>
                  <div className={styles.progressBar}>
                    <div className={styles.progress}></div>
                  </div>
                </div> */}

                {/* <p className={styles.productCode}>{p.code}</p> */}
              </div>

              {/* Actions */}
              <div className={styles.productActions}>
                <button className={`${styles.button} ${styles.buttonAdd}`}>
                  <i className="fas fa-cart-plus"></i> Add
                </button>

                <button className={`${styles.button} ${styles.buttonDetails}`}>
                  Details
                </button>
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default ProductList;
