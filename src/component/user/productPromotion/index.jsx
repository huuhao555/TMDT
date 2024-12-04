import "./styleSlide.scss";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";
import Notification, {
  NotificationContainer
} from "../../../component/user/Notification";
import { apiLink } from "../../../config/api";
const ProductsPromotionComponent = () => {
  const { user } = useContext(UserContext) || {};
  const { notifications, addNotification } = NotificationContainer();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const handleBuyProduct = async (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập");
      return;
    }
    try {
      const response = await fetch(apiLink + "/api/cart/add-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.dataUser?.id,
          productId: product?._id,
          quantity: 1,
          prices: product?.prices?.toLocaleString("vi-VN")
        })
      });

      if (!response.ok) throw new Error(response.statusText);

      const dataCart = await response.json();
      addNotification("Thêm giỏ hàng thành công!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setProducts(data.data.filter((product) => product.discount > 0));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleTitle = () => {
    navigate(`${ROUTERS.USER.PRODUCTS_BYCATEGORY}/san-pham-giam-gia`, {
      state: { id: "discount" }
    });
  };
  return (
    <div className="productPromotion-wrapper">
      <h2 onClick={handleTitle} className="productPromotion-title">
        Sản phẩm giảm giá
      </h2>
      <button className="slider-control prev" onClick={handlePrev}>
        {"<"}
      </button>
      <div
        className="productPromotion-list"
        style={{ transform: `translateX(-${currentIndex * 310}px)` }}
      >
        {products.map((product) => (
          <div className="productPromotion-item" key={product._id}>
            <Link to={`${ROUTERS.USER.DETAILS}/${product._id}`} state={product}>
              <img
                className="add-to-img"
                src={product.imageUrl}
                alt={product.name}
              />
            </Link>

            <div className="item-productPromotion-bottom">
              <Link
                to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                state={{ productId: product?._id }}
              >
                <h3>{product.name}</h3>
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
      <button className="slider-control next" onClick={handleNext}>
        {">"}
      </button>
      <div className="notifications-wrapper">
        {notifications.map((notification) => (
          <Notification key={notification.id} message={notification.message} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPromotionComponent;
