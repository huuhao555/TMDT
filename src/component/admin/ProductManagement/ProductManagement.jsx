import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../middleware/UserContext";
import { NotificationContext } from "../../../middleware/NotificationContext";
import "./style.scss";

const ProductManagement = () => {
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/product/getAllProduct"
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/product/delete-product/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const deletedProduct = products.find((product) => product._id === id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        addNotification(
          `${deletedProduct?.name} đã được xoá khỏi danh sách sản phẩm.`
        );
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
          <h5 className="product-title">{product.name}</h5>
          <p className="product-price">
            {product.prices.toLocaleString("vi-VN")}đ
          </p>
          <p className="product-remaining">
            {product.quantityInStock > 0
              ? `${product.quantityInStock} products available`
              : "Sold Out"}
          </p>
          <div className="action-buttons">
            <Link
              to={`${ROUTERS.ADMIN.UPDATE_PRODUCT}/${product._id}`}
              className="edit-btn"
              state={{ product, id: product._id }}
            >
              ✏️
            </Link>
            {user?.dataUser?.isAdmin && (
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="delete-btn"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductManagement;
