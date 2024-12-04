import { memo, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";
import ReviewSection from "../../../component/user/ReviewProduct";
import { apiLink } from "../../../config/api";
import Notification, { NotificationContainer } from "../../../component/user/Notification"


const ProductDetails = () => {
    const { user, updateCartCount } = useContext(UserContext);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const location = useLocation();
    const { product } = location.state || {};

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
                </div>
                <ReviewSection productId={product?._id} />
            </div>
        </>
    );
};

export default memo(ProductDetails);
