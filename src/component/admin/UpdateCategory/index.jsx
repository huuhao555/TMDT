import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../middleware/NotificationContext";
import { ROUTERS } from "../../../router/path";
import { apiLink } from "../../../config/api";

const UpdateCategory = () => {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { product = {}, id = "" } = location.state || {};

  const [formData, setFormData] = useState({
    name: product.name || "",
    imageUrl: product.iconUrl || ""
  });
  const [iconUrl, setIconUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconUrl(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formToSubmit = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formToSubmit.append(key, formData[key]);
        }
      });

      if (iconUrl) formToSubmit.append("image", iconUrl);

      const token = localStorage.getItem("access_token");
      const response = await fetch(apiLink + `/api/category/update/${id}`, {
        method: "PUT",
        headers: {
          token: `Bearer ${token}`
        },
        body: formToSubmit
      });

      if (!response.ok) throw new Error("Failed to update product");

      addNotification(`${formData.name} được cập nhật thành công.`);
      navigate(ROUTERS.ADMIN.MANAGE_PRODUCT_TYPES);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "Cập nhật loại sản phẩm không thành công. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  return (
    <div className="create-product-admin">
      <h1>Sửa Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên loại sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="image">
          <label>Ảnh sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Product Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>

        <button type="submit">Sửa loại sản phẩm</button>
      </form>
    </div>
  );
};

export default UpdateCategory;
