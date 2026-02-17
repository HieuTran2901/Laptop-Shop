import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Pagination from "../../components/Pagination";
import { Autoplay } from "swiper/modules";

import styles from "../../css/DetailProduct/RelatedProduct.module.css";

function RelatedProduct({ relatedProducts, addToCart, isLoggedIn }) {
  return (
    <section className={styles.relatedProductsSection}>
      <h2>Sản phẩm thường mua cùng</h2>
      <p className={styles.relatedDesc}>
        Khách hàng thường mua thêm các phụ kiện chính hãng để tối ưu trải nghiệm
        sử dụng Surface Laptop 6
      </p>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
          1280: { slidesPerView: 5, spaceBetween: 30 },
        }}
        className={styles.relatedSwiper}
      >
        {relatedProducts.map((item) => (
          <SwiperSlide key={item.id}>
            <div className={styles.relatedCard}>
              <div className={styles.relatedImageWrapper}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.relatedImage}
                />
                {item.discount > 0 && (
                  <span className={styles.relatedDiscount}>
                    -{item.discount}%
                  </span>
                )}
                {item.isGift && (
                  <span className={styles.relatedGift}>Tặng kèm</span>
                )}
              </div>
              <h3 className={styles.relatedName}>{item.name}</h3>
              <div className={styles.relatedPrice}>
                {item.price === 0 ? (
                  <span className={styles.free}>Miễn phí / Tặng kèm</span>
                ) : (
                  <>
                    {item.price.toLocaleString("vi-VN")}₫
                    {item.discount > 0 && (
                      <span className={styles.oldRelatedPrice}>
                        {(item.price * 1.2).toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </>
                )}
              </div>
              <button
                className={styles.relatedAddBtn}
                onClick={() => {
                  if (!isLoggedIn) {
                    alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
                    return;
                  }
                  addToCart(item.id, 1);
                  alert(`${item.name} đã được thêm vào giỏ hàng!`);
                }}
              >
                Thêm vào giỏ
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default RelatedProduct;
