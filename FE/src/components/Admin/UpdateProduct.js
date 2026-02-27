import React, { useEffect, useState, useRef } from "react";
import { updateProduct, getProductById } from "../../services/productService";
import { uploadImages } from "../../services/uploadService";
import styles from "../../css/ProductForm.module.css";

function UpdateProduct({ productId, onProductUpdated }) {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    description: "",
    specs: "",
    images: [],
    category: "",
    ram: "",
    cpu: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  // 🔹 Load product
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(productId);

      setProduct({
        ...res.data,
        ram: res.data.ram || "",
        cpu: res.data.cpu || "",
      });
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ❌ Xoá ảnh cũ
  const removeOldImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ❌ Xoá ảnh mới
  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedUrls = [];

      if (imageFiles.length > 0) {
        uploadedUrls = await Promise.all(
          imageFiles.map((file) =>
            uploadImages(file).then((res) => res.data[0]),
          ),
        );
      }

      const res = await updateProduct(productId, {
        ...product,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : null,
        ram: product.ram ? parseInt(product.ram) : null,
        images: [...product.images, ...uploadedUrls],
      });

      onProductUpdated(res.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <form className={styles.productForm} onSubmit={handleSubmit}>
      <h2>Update Product</h2>

      <div className={styles.mainGrid}>
        {/* LEFT SIDE */}
        <div className={styles.leftSection}>
          <div className={styles.grid4}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input name="name" value={product.name} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Brand</label>
              <input
                name="brand"
                value={product.brand}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <input
                name="category"
                value={product.category}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>CPU</label>
              <input name="cpu" value={product.cpu} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>RAM</label>
              <select name="ram" value={product.ram} onChange={handleChange}>
                <option value="">Select</option>
                <option value="8">8GB</option>
                <option value="16">16GB</option>
                <option value="32">32GB</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Old Price</label>
              <input
                type="number"
                name="oldPrice"
                value={product.oldPrice || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.textAreaRow}>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Specifications</label>
              <textarea
                name="specs"
                rows={4}
                value={product.specs || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightSection}>
          <label>Add Images</label>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={(e) =>
              setImageFiles([...imageFiles, ...Array.from(e.target.files)])
            }
          />

          {/* Ảnh cũ */}
          <div className={styles.previewImages}>
            {product.images.map((url, i) => (
              <div key={i} className={styles.previewItem}>
                <img src={url} alt="" />
                <button type="button" onClick={() => removeOldImage(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Ảnh mới */}
          <div className={styles.previewImages}>
            {imageFiles.map((file, i) => (
              <div key={i} className={styles.previewItem}>
                <img src={URL.createObjectURL(file)} alt="" />
                <button type="button" onClick={() => removeNewImage(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button type="submit">Update Product</button>
      </div>
    </form>
  );
}

export default UpdateProduct;
