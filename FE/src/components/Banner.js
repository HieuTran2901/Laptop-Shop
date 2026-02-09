import React from "react";
import banner from "../assets/banner-bg.jpg";
import "../css/Banner.css";

const Banner = () => {
  return (
    <div className="banner position-relative overflow-hidden">
      {/* Image */}
      <img src={banner} alt="Banner Laptop" className="w-100 banner-img" />

      {/* Overlay */}
      <div className="banner-overlay"></div>

      {/* Content */}
      <div className="banner-content position-absolute top-50 start-50 translate-middle text-center text-white">
        <span className="badge bg-warning text-dark px-3 py-2 mb-3">
          🔥 Giảm đến 30%
        </span>

        <h1 className="fw-bold mb-3">
          Laptop Chính Hãng <br /> Giá Tốt Nhất
        </h1>

        <p className="mb-4">Gaming • Văn phòng • Đồ họa • Sinh viên</p>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-warning btn-lg px-4">
            <i className="fas fa-shopping-cart me-2"></i>
            Mua Ngay
          </button>
          <button className="btn btn-outline-light btn-lg px-4">
            Xem Ưu Đãi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
