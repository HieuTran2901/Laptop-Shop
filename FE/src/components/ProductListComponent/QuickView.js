import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { useCart } from "../../context/CartContext";

import "swiper/css";
import "swiper/css/navigation";
import "../../css/ProductList/QuickView.css";
import "../../css/ProductList/Swiper.css";

import Alert from "../Alert";

function QuickView({ selectedProduct, setSelectedProduct }) {
  const [closing, setClosing] = useState(false);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  // Check if user is logged in by looking for a token in localStorage
  // !! to convert the value to a boolean (true if token exists, false if not)
  const isLoggedIn = !!localStorage.getItem("token");

  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    if (mainSwiper) {
      mainSwiper.slideTo(0, 0);
    }
  }, [selectedProduct, mainSwiper]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setSelectedProduct(null), 250);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    addToCart(selectedProduct.id, quantity);
  };

  return (
    <div
      className={`quickview-overlay ${closing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`quickview-modal ${closing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="quickview-close" onClick={handleClose}>
          ✕
        </button>

        <div className="quickview-content">
          {/* IMAGE */}
          <div className="quickview-image">
            {/* MAIN SWIPER */}
            <Swiper
              modules={[Navigation]}
              navigation
              onSwiper={setMainSwiper}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="main-swiper"
            >
              {selectedProduct.images?.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`main-${idx}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* THUMBNAILS */}
            <div className="thumb-wrapper">
              <div className="thumb-nav">
                <div className="thumb-prev">‹</div>
                <div className="thumb-next">›</div>
              </div>

              <Swiper
                modules={[Navigation]}
                breakpoints={{
                  0: { slidesPerView: 4 }, // mobile
                  640: { slidesPerView: 5 }, // tablet
                  1024: { slidesPerView: 5 }, // desktop
                }}
                spaceBetween={10}
                navigation={{
                  prevEl: ".thumb-prev",
                  nextEl: ".thumb-next",
                }}
                className="thumb-swiper"
              >
                {selectedProduct.images?.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      alt=""
                      src={img}
                      className={`thumbnail ${activeIndex === idx ? "active" : ""}`}
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

          {/* INFO */}
          <div className="quickview-info">
            <h2>{selectedProduct.name}</h2>
            <p className="brand">{selectedProduct.brand}</p>

            <div className="quickview-meta">
              <div className="rating">
                ⭐⭐⭐⭐☆ <span>(4.5)</span>
              </div>
              <span className="stock in-stock">✔ Còn hàng</span>
            </div>

            <div className="price-box">
              <span className="price">${selectedProduct.price}</span>
              <span className="old-price">${selectedProduct.price + 200}</span>
            </div>

            <div className="quickview-promo">
              🎁 Tặng balo + chuột không dây
            </div>

            <ul className="quickview-specs">
              <li>
                <strong>CPU:</strong> {selectedProduct.cpu}
              </li>
              <li>
                <strong>RAM:</strong> {selectedProduct.ram} GB
              </li>
              <li>
                <strong>SSD:</strong> 512GB NVMe
              </li>
              <li>
                <strong>Màn hình:</strong> 14” Full HD
              </li>
            </ul>

            <div className="quickview-quantity">
              <label>Số lượng:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                // + trước e.target.value để convert string sang number, tránh lỗi khi cộng dồn số lượng
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </div>

            <div className="quickview-actions">
              <button className="button button-add" onClick={handleAddToCart}>
                🛒 Thêm vào giỏ
              </button>
              <button className="button button-details">
                <Link
                  to={`/detail-product/${selectedProduct.id}`}
                  onClick={handleClose}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Xem chi tiết
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showLoginAlert && <Alert setShowLoginAlert={setShowLoginAlert} />}
    </div>
  );
}

export default QuickView;
