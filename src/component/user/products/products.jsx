import { memo, useEffect, useState, useContext } from "react";
import "./style.scss";
import { UserContext } from "../../../middleware/UserContext";
import Notification, {
  NotificationContainer
} from "../../../component/user/Notification";
const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);
  const { notifications, addNotification } = NotificationContainer();

  const renderProducts = async () => {
    try {
      const response = await fetch(
        " http://localhost:8001/api/product/getAllProduct"
      );
      if (!response.ok) throw new Error(response.statusText);

      const dataProducts = await response.json();
      setProducts(dataProducts.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };
  useEffect(() => {
    renderProducts();
  }, []);
  const handleproduct = async (idCounrse) => {
    if (!user) {
      alert("Vui lòng đăng nhập");
      return;
    }

    // if (!window.confirm("Bạn có chắc chắn muốn mua khoá học này?")) {
    //   return;
    // }
    try {
      const response = await fetch(
        `http://localhost:8001/api/product/purchase/${idCounrse}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (!response.ok) throw new Error(response.statusText);

      await response.json();
      renderProducts();
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  const handleBuyProduct = async (product) => {
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

      // updateCartCount(updatedCount);
      // alert("Thêm giỏ hàng thành công");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <div className="product-container">
      {products.map((product) => {
        return (
          <div key={product._id} className="">
            <div className="product-card">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
              <h5 className="product-title">{product.name}</h5>
              {/* <p className="product-description">{product.description}</p>  price.toLocaleString("vi-VN")*/}
              <p className="product-price">{product.prices}đ</p>
              <p className="product-remaining">
                {product.quantityInStock > 0
                  ? `${product.quantityInStock} seats available`
                  : "Sold Out"}
              </p>
              <button
                onClick={() => {
                  handleBuyProduct(product);
                }}
                className="btn btn-primary"
                disabled={product.quantityInStock === 0}
              >
                {product.quantityInStock > 0 ? "Thêm giỏ hàng" : "Sold Out"}
              </button>
            </div>
          </div>
        );
      })}
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

export default memo(ProductComponent);
