import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../middleware/NotificationContext";

const CreateProduct = () => {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const renderCategory = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/category/getAll"
        );
        if (!response.ok) {
          console.log("Error fetching categories");
          return;
        }
        const dataCategory = await response.json();
        setCategory(Array.isArray(dataCategory.data) ? dataCategory.data : []);
      } catch (error) {
        console.log(error);
      }
    };
    renderCategory();
  }, []);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantityInStock: "",
    prices: "",
    color: "",
    size: "",
    brand: "",
    gender: "",
    category: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleBannerChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      // Thêm hình ảnh
      if (imageFile) data.append("image", imageFile);
      if (bannerFile) data.append("banner", bannerFile);

      const response = await fetch("http://localhost:8001/api/product/create", {
        method: "POST",
        body: data
      });
      console.log(...data);
      if (!response.ok) {
        alert(
          "Thêm sản phẩm không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }

      alert("Thêm sản phẩm thành công");
      addNotification(`${formData.name} được thêm vào danh sách sản phẩm.`);
      navigate("/admin/quan-ly-san-pham");

      // Reset form
      setFormData({
        name: "",
        quantityInStock: "",
        prices: "",
        color: "",
        size: "",
        brand: "",
        gender: "",
        category: ""
      });
      setImageFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-product-admin">
      <h1>Tạo Sản Phẩm</h1>
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
            type="number"
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
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Product Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <div className="banner">
          <label>Banner sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleBannerChange} />
          {bannerFile && (
            <img
              src={URL.createObjectURL(bannerFile)}
              alt="Banner Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
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
          <label>Loại sản phẩm (Category):</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Chọn loại sản phẩm</option>
            {category.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default CreateProduct;
