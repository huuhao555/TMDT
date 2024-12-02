import { memo, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state || {};
  const dataId = product?.category;
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useContext(UserContext) || {};

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8001/api/product/getAllProduct"
      );
      if (!response.ok) throw new Error(response.statusText);

      const dataProducts = await response.json();
      const filteredProducts = dataProducts.data.filter(
        (product) => product.category === dataId
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
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

      await response.json();
      // addNotification("Thêm giỏ hàng thành công!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [dataId]);
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

  return (
    <>
      <div className="product-detail">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="product-detail__image-section">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-detail__image"
                />
              </div>
              <div className="product-detail__details">
                <ul>
                  <li>Thương hiệu: {product.brand}</li>
                  <li>Kích thước: {product.size}</li>
                  <li>Màu sắc: {product.color}</li>
                  <li>Danh mục: {product.category?.name}</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="product-detail__header">
                <div className="product-detail__info">
                  <h2 className="product-detail__title">{product.name}</h2>
                  <div className="product-detail__price">
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
                            {parseInt(product?.prices)?.toLocaleString("vi-VN")}
                            ₫
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
                  </div>
                  <button
                    onClick={() => handleBuyProduct(product)}
                    className="product-detail__add-to-cart"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
              <div className="product-detail__description">
                <span> Hỗ trợ đổi mới trong 7 ngày.</span>
                <span> Sửa chữa thay mới linh kiện toàn quốc.</span>
                <span> Tư vấn miễn phí 24/7.</span>
                <span>Thanh toán khi nhận hàng (COD) trên toàn quốc.</span>
                <span>Được kiểm tra sản phẩm trước khi thanh toán.</span>
                <span> Đổi trả dễ dàng nếu sản phẩm lỗi.</span>
              </div>
            </div>
          </div>
          <div className="productSlide-wrapper">
            <button className="slider-control prev" onClick={handlePrev}>
              {"<"}
            </button>
            <h2>Sản phẩm liên quan:</h2>
            <div
              className="productSlide-list"
              style={{ transform: `translateX(-${currentIndex * 310}px)` }}
            >
              {products.map((product) => (
                <div className="productSlide-item" key={product._id}>
                  <Link
                    to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                    state={product}
                  >
                    <img
                      className="add-to-img"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </Link>
                  <Link
                    to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                    state={product}
                  >
                    <div className="item-productSlide-bottom">
                      <h3>{product.name}</h3>
                      <p>{product.prices.toLocaleString("vi-VN")} ₫</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="slider-control next" onClick={handleNext}>
              {">"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductDetail);
