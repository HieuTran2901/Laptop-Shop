import Header from "../components/Header";
import Footer from "../components/Footer";

import { getProductById } from "../services/productService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "../css/DetailProduct.module.css";
import "../css/ProductList/Swiper.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

import { useCart } from "../context/CartContext";

function DetailProducts() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ===== COMMENT STATE ===== */
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Máy rất đẹp, chạy mượt, pin trâu 👍",
      date: "02/02/2026",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      content: "Màn hình đẹp, nhưng giá hơi cao.",
      date: "01/02/2026",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  /* ===== FETCH PRODUCT ===== */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  /* ===== RESET SWIPER WHEN PRODUCT CHANGES ===== */
  useEffect(() => {
    setActiveIndex(0);
    if (mainSwiper) {
      mainSwiper.slideTo(0, 0);
    }
  }, [product, mainSwiper]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    addToCart(product.id, quantity);
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        {/* ================= TOP ================= */}
        <div className={styles.productDetail}>
          {/* ===== LEFT - IMAGE GALLERY ===== */}
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
                  <img src={img} alt={`main-${idx}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* THUMBNAILS */}
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
                      alt={`thumb-${idx}`}
                      className={`${styles.thumbnail} ${
                        activeIndex === idx ? styles.active : ""
                      }`}
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

          {/* ===== RIGHT - PRODUCT INFO ===== */}
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.productMeta}>
              <span className={styles.brand}>{product.brand}</span>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={i < 4 ? solidStar : regularStar}
                    className={styles.star}
                  />
                ))}
                <span className={styles.ratingText}>4.6</span>
              </div>
              <span className={styles.sold}>Đã bán 1.245</span>
            </div>

            <div className={styles.priceBox}>
              <span className={styles.price}>{product.price}₫</span>
              <span className={styles.oldPrice}>{product.oldPrice}</span>
              <span className={styles.discount}>-12%</span>
            </div>

            <div className={styles.inStock}>✔ Còn hàng – Giao ngay</div>

            <div className={styles.promoBox}>
              <h4>🎁 Khuyến mãi</h4>
              <ul>
                <li>✔ Tặng balo laptop cao cấp</li>
                <li>✔ Chuột không dây chính hãng</li>
                <li>✔ Giảm thêm 500.000₫ khi thanh toán online</li>
              </ul>
            </div>

            <div className={styles.specsShort}>
              {product.specs.split("\n").map((line, idx) => {
                const [key, value] = line.split(":");
                return (
                  <p key={idx}>
                    <strong>{key}:</strong> {value}
                  </p>
                );
              })}
            </div>

            <div className={styles.actions}>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
              <button className={styles.btnCart} onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
              <button className={styles.btnBuy}>Mua ngay</button>
            </div>

            <div className={styles.policy}>
              🚚 Giao hàng miễn phí toàn quốc <br />
              🔁 Đổi trả 7 ngày <br />
              🛡️ Bảo hành chính hãng 12 tháng
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className={styles.productTabs}>
          {/* DESCRIPTION */}
          <section className={styles.tabSection}>
            <h2>Mô tả sản phẩm</h2>
            <p>
              Surface Laptop 6 là dòng laptop cao cấp của Microsoft, nổi bật với
              thiết kế mỏng nhẹ, màn hình PixelSense sắc nét và hiệu năng mạnh
              mẽ.
            </p>
            <ul>
              <li>Thiết kế nhôm nguyên khối cao cấp</li>
              <li>Pin sử dụng lên đến 15 giờ</li>
              <li>Bàn phím gõ êm, trackpad lớn</li>
              <li>Phù hợp học tập, làm việc và lập trình</li>
            </ul>
          </section>

          {/* SPEC TABLE */}
          <section className={styles.tabSection}>
            <h2>Thông số kỹ thuật</h2>
            <table className={styles.specTable}>
              <tbody>
                <tr>
                  <td>CPU</td>
                  <td>Intel Core Ultra 7</td>
                </tr>
                <tr>
                  <td>RAM</td>
                  <td>16GB LPDDR5</td>
                </tr>
                <tr>
                  <td>Card đồ họa</td>
                  <td>Intel Arc Graphics</td>
                </tr>
                <tr>
                  <td>Ổ cứng</td>
                  <td>512GB NVMe SSD</td>
                </tr>
                <tr>
                  <td>Màn hình</td>
                  <td>13.8" PixelSense</td>
                </tr>
                <tr>
                  <td>GPU</td>
                  <td>Intel Arc Graphics</td>
                </tr>
                <tr>
                  <td>Pin</td>
                  <td>Lên đến 15 giờ</td>
                </tr>
                <tr>
                  <td>Trọng lượng</td>
                  <td>~1.3kg</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* ================= COMMENTS ================= */}
          <section className={styles.commentSection}>
            <h2>Đánh giá & Bình luận</h2>

            <div className={styles.ratingSummary}>
              <div className={styles.ratingScore}>
                <h3>4.6</h3>
                <div className={styles.star}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < 4 ? solidStar : regularStar}
                      className={styles.starLarge}
                    />
                  ))}
                </div>
                <p>120 đánh giá</p>
              </div>

              <div className={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className={styles.ratingBar}>
                    <span>
                      {star}{" "}
                      <FontAwesomeIcon
                        icon={solidStar}
                        className={styles.star}
                      />
                    </span>
                    <div className={styles.ratingTrack}>
                      <div
                        className={styles.ratingFill}
                        style={{ width: `${star * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <div className={styles.commentForm}>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} ⭐
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Nhập bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <button
                onClick={() => {
                  if (!newComment.trim()) return;

                  setComments([
                    {
                      id: Date.now(),
                      name: "Khách hàng",
                      rating: newRating,
                      content: newComment,
                      date: new Date().toLocaleDateString(),
                    },
                    ...comments,
                  ]);
                  setNewComment("");
                  setNewRating(5);
                }}
              >
                Gửi đánh giá
              </button>
            </div>

            {/* LIST */}
            <div className={styles.commentList}>
              {comments.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <strong>{c.name}</strong>
                    <span>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={i < c.rating ? solidStar : regularStar}
                          className={styles.star}
                        />
                      ))}
                    </span>
                  </div>
                  <p>{c.content}</p>
                  <small>{c.date}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DetailProducts;
