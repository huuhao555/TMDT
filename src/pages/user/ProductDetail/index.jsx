import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../../router/path";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state || {};
  const dataId = product?.category?._id;
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8001/api/product/getAllProduct"
      );
      if (!response.ok) throw new Error(response.statusText);

      const dataProducts = await response.json();
      const filteredProducts = dataProducts.data.filter(
        (product) => product.category._id === dataId
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
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
                  <p className="product-detail__price">
                    {product.prices?.toLocaleString("vi-VN")} VNĐ
                  </p>
                  <button className="product-detail__add-to-cart">
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
                      <p>{product.prices.toLocaleString("vi-VN")} VNĐ</p>
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
