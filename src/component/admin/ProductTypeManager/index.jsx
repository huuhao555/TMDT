import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../middleware/UserContext";
import { NotificationContext } from "../../../middleware/NotificationContext";
import "./style.scss";

import { ROUTERS } from "../../../router/path";

const ProductTypeManagement = () => {
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/category/getAll"
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setCategories([]);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    console.log(id);
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        const response = await fetch(
          `http://localhost:8001/api/category/delete/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const deletedProduct = categories.find(
          (category) => category._id === id
        );
        setCategories((prevProducts) =>
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

  const currentProducts = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại sản phẩm</th>
              <th>Nhãn hàng</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((category, index) => {
              return (
                <tr key={category?._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="product-info">
                      <img
                        src={category?.iconUrl}
                        alt={category?.name}
                        style={{ width: "100px" }}
                      />
                      <div>
                        <h4>{category?.name}</h4>
                      </div>
                    </div>
                  </td>
                  <td>{category?.brand}</td>
                  <td>{category?.quantityInStock}</td>
                  <td>{category?.prices}</td>

                  <td>
                    <button className="view-btn">👁️</button>
                    <Link
                      to={`${ROUTERS.ADMIN.UPDATE_CATEGORY}/${category?._id}`}
                      className="edit-btn"
                      state={{ category, id: category?._id }}
                    >
                      ✏️
                    </Link>
                    {!user?.dataUser?.isAdmin && (
                      <button
                        onClick={() => handleDeleteProduct(category?._id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination-product-manager">
        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n + 1}
            onClick={() => setCurrentPage(n + 1)}
            className={`page-number ${currentPage === n + 1 ? "active" : ""}`}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTypeManagement;
