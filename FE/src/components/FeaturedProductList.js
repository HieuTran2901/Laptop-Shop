import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import QuickView from "./ProductListComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "../css/FeaturedProduct.module.css"; // dùng chung css
import images from "../assets/featuredproductnn.png";

const FeaturedProductList = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await getProducts({ page: 1, size: 20 });

      const featured = res.data.items.filter(
        (product) => product.featured === true,
      );

      setFeaturedProducts(featured);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={styles.productPage}>
      <img
        src={images}
        alt="Featured Products"
        className={styles.bannerImage}
      />

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={25}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {featuredProducts.map((p) => {
          const discount =
            p.oldPrice > p.price
              ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
              : 0;

          return (
            <SwiperSlide key={p.id}>
              <div className={styles.productCard}>
                {/* Discount */}
                {discount > 0 && (
                  <div className={styles.discountBadge}>-{discount}%</div>
                )}

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
                  <div className={styles.brandRow}>
                    <span className={styles.productBrand}>
                      {p.brand.toUpperCase()}
                    </span>

                    {/* <span className={styles.productBrand}>{p.brand}</span> */}
                    {/* <span className={styles.stock}>
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span> */}
                  </div>
                  <h3 className={styles.productName}>{p.name}</h3>

                  {/* Rating */}
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={
                          i < Math.floor(p.rating) ? solidStar : regularStar
                        }
                        className={styles.star}
                      />
                    ))}
                    <span className={styles.reviewCount}>
                      ({p.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Short Specs */}
                  <div className={styles.specs}>
                    <span>⚡ {p.cpu || "i7 / Ryzen 7"}</span>
                    <span>💾 {p.ram || "16GB RAM"}</span>
                    <span>⚙️ {p.storage || "512GB SSD"}</span>
                  </div>

                  {/* Price */}
                  <div className={styles.priceBox}>
                    <span className={styles.price}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(p.price)}
                    </span>

                    {discount > 0 && (
                      <span className={styles.oldPrice}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(p.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Sold Progress */}
                  {/* <div className={styles.soldBox}>
                    <div className={styles.soldText}>Sold: {p.sold || 0}</div>

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progress}
                        style={{
                          width: `${
                            p.stock
                              ? Math.min(
                                  ((p.sold || 0) / (p.stock + (p.sold || 0))) *
                                    100,
                                  100,
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div> */}

                  {/* <p className={styles.productCode}>{p.code}</p> */}
                </div>

                {/* Actions */}
                <div className={styles.productActions}>
                  <button className={`${styles.button} ${styles.buttonAdd}`}>
                    <i className="fas fa-cart-plus"></i> Add
                  </button>

                  <button
                    className={`${styles.button} ${styles.buttonDetails}`}
                  >
                    Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {selectedProduct && (
        <QuickView
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </section>
  );
};

export default FeaturedProductList;
