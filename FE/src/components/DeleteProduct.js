import { deleteProduct } from "../services/productService";

function DeleteProduct({ productId, onProductDeleted }) {
  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      console.log("Product deleted:", productId);
      onProductDeleted(productId); // Cập nhật danh sách sản phẩm sau khi xóa
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return <button onClick={handleDelete}>Delete Product</button>;
}

export default DeleteProduct;
