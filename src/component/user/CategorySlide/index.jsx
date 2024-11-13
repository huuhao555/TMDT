import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import { UserContext } from "../../../middleware/UserContext";
import Notification, {
  NotificationContainer
} from "../../../component/user/Notification";
const CategorySlider = ({ categoryId, products, categoryName }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { notifications, addNotification } = NotificationContainer();

  const filteredProducts = products.filter(
    (product) => product.category._id === categoryId
  );
  const { user } = useContext(UserContext) || {};

  const slideWidth = 300;
  const slideGap = 10;
  const slidesToShow = 4;

  const slideLeft = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const slideRight = () => {
    const maxSlide = filteredProducts.length - slidesToShow;
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  useEffect(() => {
    document.querySelector(
      ".productSlide-list"
    ).style.transform = `translateX(-${
      currentSlide * (slideWidth + slideGap)
    }px)`;
  }, [currentSlide]);
  const handleCategory = () => {
    alert(123);
  };

  const handleBuyProduct = async (product) => {
    console.log(user);
    if (!user) alert("Vui lòng đăng nhập");
    try {
      const response = await fetch(
        "http://localhost:8001/api/cart/add-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.dataUser.id,
            productId: product._id,
            quantity: 1,
            prices: product.prices.toLocaleString("vi-VN")
          })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const dataCart = await response.json();
      addNotification("Thêm giỏ hàng thành công!");

      const updatedCount = dataCart.data.products.length;
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };
  return (
    <div className="category-slider">
      <h3 className="category-title" onClick={handleCategory}>
        {categoryName}
      </h3>
      <div className="productSlide-wrapper">
        <button className="slider-control prev" onClick={slideLeft}>
          &#10094;
        </button>
        <div className="productSlide-list">
          {filteredProducts.map((product) => (
            <div key={product._id} className="productSlide-item">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="add-to-img"
              />
              <div className="item-productSlide-bottom">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{product.prices}đ</p>
                <p className="product-remaining">
                  {product.quantityInStock > 0
                    ? `${product.quantityInStock} còn lại`
                    : "Hết hàng"}
                </p>
                <button
                  onClick={() => {
                    handleBuyProduct(product);
                  }}
                  className="btn btn-primary"
                  disabled={product.quantityInStock === 0}
                >
                  {product.quantityInStock > 0 ? "Buy product" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-control next" onClick={slideRight}>
          &#10095;
        </button>
      </div>
      <div className="notifications-wrapper">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={() => {
              // Dọn dẹp thông báo
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
