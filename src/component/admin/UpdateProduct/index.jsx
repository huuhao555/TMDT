import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../middleware/NotificationContext";
import { apiLink } from "../../../config/api";

const UpdateProduct = () => {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { product = {}, id = "" } = location.state || {};

  const [formData, setFormData] = useState({
    name: product.name || "",
    quantityInStock: product.quantityInStock || 0,
    prices: product.prices || 0,
    color: product.color || "",
    size: product.size || "",
    discount: product.discount || "",
    imageUrl: product.imageUrl || "",
    bannerUrl: product.bannerUrl || "",
    brand: product.brand || "",
    gender: product.gender || "",
    category: product.category ? product.category : 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiLink + "/api/category/getAll");
        if (!response.ok) throw new Error("Error fetching categories");
        const dataCategory = await response.json();
        setCategory(Array.isArray(dataCategory.data) ? dataCategory.data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setFormData({ ...formData, bannerUrl: URL.createObjectURL(file) });
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

      if (imageFile) formToSubmit.append("image", imageFile);
      if (bannerFile) formToSubmit.append("banner", bannerFile);

      const token = localStorage.getItem("token");
      const response = await fetch(apiLink + `/api/product/update/${id}`, {
        method: "PUT",
        headers: {
          token: `Bearer ${token}`
        },
        body: formToSubmit
      });

      if (!response.ok) throw new Error("Failed to update product");

      addNotification(`${formData.name} được cập nhật thành công.`);
      navigate("/admin/quan-ly-san-pham");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "Cập nhật sản phẩm không thành công. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  return (
    <div className="create-product-admin">
      <h1>Sửa Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Loại sản phẩm (Category):</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại sản phẩm</option>
            {category.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Số lượng trong kho:</label>
          <input
            type="number"
            name="quantityInStock"
            value={formData.quantityInStock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Giá:</label>
          <input
            type="number"
            name="prices"
            value={formData.prices}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold", color: "#555" }}>
            Giảm giá (%)
          </label>
          <div style={{ display: "flex" }}>
            <input
              style={{ width: "12%", marginRight: "20px" }}
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min={0}
            ></input>{" "}
            <span
              style={{
                marginTop: "10px",
                fontSize: "18px",
                marginLeft: "-10px"
              }}
            >
              %
            </span>
          </div>
        </div>
        <div>
          <label>Giới tính:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Chọn giới tính</option>
            <option value="nam">Nam</option>
            <option value="nữ">Nữ</option>
          </select>
        </div>
        <div>
          <label>Màu sắc:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Kích thước:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Thương hiệu:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
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
        <div className="banner">
          <label>Banner sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleBannerChange} />
          {formData.bannerUrl && (
            <img
              src={formData.bannerUrl}
              alt="Banner Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>

        <button type="submit">Sửa sản phẩm</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
