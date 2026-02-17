import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { getProductById } from "../../services/productService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import styles from "../../css/DetailProduct/DetailProduct.module.css";
import "../../css/ProductList/Swiper.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../../context/CartContext";

import { relatedProducts } from "../../components/Data/detailProductcomp";

import RelatedProduct from "./RelatedProduct";
import CommentSection from "./CommentSection";
import FAQSection from "./FAQSection";
import TechNews from "./TechNews";
import SpecsSection from "./SpecsSection";

function DetailProducts() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Máy rất đẹp, chạy mượt, pin trâu thật sự 👍",
      date: "02/02/2026",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      content:
        "Màn hình đẹp xuất sắc, bàn phím gõ thoải mái, nhưng giá hơi cao.",
      date: "01/02/2026",
    },
    {
      id: 3,
      name: "Lê Hoàng C",
      rating: 5,
      content: "Copilot tích hợp mượt, làm việc văn phòng và code cực kỳ ổn.",
      date: "28/01/2026",
    },
  ]);

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
        ).toFixed(1)
      : "0.0";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", err);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setActiveIndex(0);
    if (mainSwiper) mainSwiper.slideTo(0, 0);
  }, [product, mainSwiper]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    addToCart(product.id, quantity);
  };

  if (!product)
    return <div className={styles.loading}>Đang tải thông tin sản phẩm...</div>;

  // Danh sách tin tức công nghệ 2026 (cập nhật từ nguồn thực tế tháng 2/2026)

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* TOP: Gallery + Info */}
        <div className={styles.productDetail}>
          <div className={styles.productGallery}>
            <Swiper
              modules={[Navigation]}
              navigation
              onSwiper={setMainSwiper}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className={styles.mainSwiper}
            >
              {product.images?.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`${product.name} - ${idx + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={styles.thumbWrapper}>
              <div className={styles.thumbNav}>
                <div className={styles.thumbPrev}>‹</div>
                <div className={styles.thumbNext}>›</div>
              </div>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: `.${styles.thumbPrev}`,
                  nextEl: `.${styles.thumbNext}`,
                }}
                slidesPerView={7}
                spaceBetween={10}
                className={styles.thumbSwiper}
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`thumb-${idx + 1}`}
                      className={`${styles.thumbnail} ${activeIndex === idx ? styles.active : ""}`}
                      onClick={() => {
                        setActiveIndex(idx);
                        mainSwiper?.slideTo(idx);
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.productMeta}>
              <span className={styles.brand}>{product.brand}</span>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={
                      i < Math.floor(averageRating) ? solidStar : regularStar
                    }
                    className={styles.star}
                  />
                ))}
                <span className={styles.ratingText}>
                  {averageRating} ({comments.length} đánh giá)
                </span>
              </div>
              <span className={styles.sold}>
                Đã bán {product.sold || "1.245"}
              </span>
            </div>

            <div className={styles.priceBox}>
              <span className={styles.price}>
                {product.price.toLocaleString("vi-VN")}₫
              </span>
              {product.oldPrice && (
                <>
                  <span className={styles.oldPrice}>
                    {product.oldPrice.toLocaleString("vi-VN")}₫
                  </span>
                  <span className={styles.discount}>
                    -
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100,
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            <div className={styles.inStock}>
              ✔ Còn hàng – Giao ngay trong 2-4 giờ tại nội thành
            </div>

            <div className={styles.promoBox}>
              <h4>🎁 Ưu đãi đặc biệt</h4>
              <ul>
                <li>Tặng balo chống sốc cao cấp</li>
                <li>Tặng chuột Microsoft Bluetooth</li>
                <li>Giảm 500.000₫ thanh toán online</li>
                <li>Trả góp 0% lãi suất 12 tháng</li>
              </ul>
            </div>

            <div className={styles.specsShort}>
              {product.specs?.split("\n").map((line, idx) => {
                const [key, value] = line.split(":");
                return (
                  <p key={idx}>
                    <strong>{key?.trim()}:</strong> {value?.trim()}
                  </p>
                );
              })}
            </div>

            <div className={styles.actions}>
              <div className={styles.quantityControl}>
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
                />
                <button onClick={() => setQuantity((prev) => prev + 1)}>
                  +
                </button>
              </div>
              <button className={styles.btnCart} onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
              <button className={styles.btnBuy}>Mua ngay</button>
            </div>

            <div className={styles.policy}>
              🚚 Giao miễn phí toàn quốc
              <br />
              🔁 Đổi trả 7 ngày
              <br />
              🛡️ Bảo hành chính hãng 12 tháng
            </div>
          </div>
        </div>

        {/* BOTTOM TABS */}
        <div className={styles.productTabs}>
          {/* Thông số nổi bật=*/}
          <SpecsSection />

          {/* Các phần còn lại giữ nguyên */}
          <TechNews />
          <FAQSection />
          <RelatedProduct
            relatedProducts={relatedProducts}
            addToCart={addToCart}
            isLoggedIn={isLoggedIn}
          />
          <CommentSection
            averageRating={averageRating}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DetailProducts;
