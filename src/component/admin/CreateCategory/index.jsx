import React, { useContext, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../middleware/NotificationContext";

const CreateCategory = () => {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [iconUrl, setIconUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setIconUrl(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);

      if (iconUrl) {
        data.append("icon", iconUrl);
      }

      const response = await fetch(
        "http://localhost:8001/api/category/create",
        {
          method: "POST",
          body: data
        }
      );
      console.log(...data);
      console.log(response);

      if (!response.ok) {
        alert(
          "Thêm sản phẩm không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }
      alert("Thêm sản phẩm thành công");
      addNotification(`${formData.name} được thêm vào danh sách sản phẩm.`);
      navigate("/admin/quan-ly-san-pham");

      setFormData({ name: "" });
      setIconUrl(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="simple-create-product">
      <h1>Tạo Loại Sản Phẩm</h1>
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
        <div>
          <label>Icon loại sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {iconUrl && (
            <img
              src={URL.createObjectURL(iconUrl)}
              alt="Product Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit">Thêm loại sản phẩm</button>
      </form>
    </div>
  );
};

export default CreateCategory;
