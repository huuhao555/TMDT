import React, { useState, useRef, useContext } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";
import Notification, {
  NotificationContainer
} from "../../../component/user/Notification";

const CategorySlider = ({ categoryId, products, categoryName }) => {
  const { user } = useContext(UserContext) || {};
  const { notifications, addNotification } = NotificationContainer();
  const navigate = useNavigate();
  const filteredProducts = products.filter(
    (product) => product.category === categoryId
  );

  const productListRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - productListRef.current.offsetLeft);
    setScrollLeft(productListRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - productListRef.current.offsetLeft;
    const walk = x - startX;
    productListRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const scrollTo = (direction) => {
    const scrollAmount = 300; // Khoảng cách cuộn
    productListRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const handleBuyProduct = async (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8001/api/cart/add-update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.dataUser?.id,
            productId: product?._id,
            quantity: 1,
            prices: product?.prices?.toLocaleString("vi-VN")
          })
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const dataCart = await response.json();
      addNotification("Thêm giỏ hàng thành công!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };
  const handleTitle = () => {
    navigate(`${ROUTERS.USER.PRODUCTS_BYCATEGORY}/${categoryName}`, {
      state: { id: categoryId }
    });
  };
  return (
    <div className="category-slider">
      <h3 className="category-title" onClick={handleTitle}>
        {categoryName}
      </h3>
      <div className="productSlide-wrapper">
        <button
          className="slider-control prev"
          onClick={() => scrollTo("left")}
        >
          &lt;
        </button>
        <div
          className="productSlide-list"
          ref={productListRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {filteredProducts.map((product) => (
            <div key={product._id} className="productSlide-item">
              <Link
                to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                state={product}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="add-to-img"
                />
              </Link>
              <div className="item-productSlide-bottom">
                <Link
                  to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                  state={product}
                >
                  <h3 className="product-title">{product.name}</h3>

                  <div className="grp-price">
                    {product?.prices == parseInt(product?.promotionPrice) ? (
                      <p className="price">
                        {parseInt(
                          parseInt(product?.promotionPrice)
                        )?.toLocaleString("vi-VN")}
                        ₫
                      </p>
                    ) : (
                      <>
                        <p className="price-old">
                          {parseInt(product?.prices)?.toLocaleString("vi-VN")}₫
                        </p>
                        <div className="price-new">
                          <p className="price-discount">
                            {parseInt(
                              parseInt(product?.promotionPrice)
                            )?.toLocaleString("vi-VN")}
                            ₫
                          </p>
                          <p className="discount">{`-${product?.discount}%`}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="product-remaining">
                    {product.quantityInStock > 0
                      ? `Số lượng còn ${product.quantityInStock}`
                      : "Hết hàng"}
                  </p>
                </Link>
                <button
                  onClick={() => handleBuyProduct(product)}
                  className="btn add-to-cart-detail"
                  disabled={product.quantityInStock === 0}
                >
                  {product.quantityInStock > 0 ? "Thêm giỏ hàng" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="slider-control next"
          onClick={() => scrollTo("right")}
        >
          &gt;
        </button>
      </div>
      <div className="notifications-wrapper">
        {notifications.map((notification) => (
          <Notification key={notification.id} message={notification.message} />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
