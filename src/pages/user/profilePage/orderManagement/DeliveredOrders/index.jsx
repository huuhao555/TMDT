import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../middleware/UserContext";
import "../style.scss";
import { ROUTERS } from "../../../../../router/path";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineDown,
  AiOutlineDownCircle,
  AiOutlineDownSquare,
  AiOutlineEye,
  AiOutlineEyeInvisible
} from "react-icons/ai";
import { apiLink } from "../../../../../config/api";
const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext) || {};
  const [visibleOrders, setVisibleOrders] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const navigator = useNavigate();
  const handleReview = () => {
    if (!selectedProduct) {
      alert("Vui lòng chọn sản phẩm để đánh giá!");
      return;
    }

    navigator(ROUTERS.USER.ADD_REVIEW, {
      state: { productId: selectedProduct }
    });
  };
  useEffect(() => {
    const fetchPendingOrders = async () => {
      const userId = user?.dataUser?.id;
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const response = await fetch(apiLink + `/api/order/getAll/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data?.data.filter((order) => order.status === "Delivered"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
  }, [user]);
  const toggleOrderVisibility = (orderId) => {
    setVisibleOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  return (
    <div className="orders-list">
      {orders.length > 0 ? (
        <div>
          {orders?.map((order, orderIndex) => (
            <div key={order.id} className="order">
              <AiOutlineDownCircle
                className="icon-down"
                onClick={() => toggleOrderVisibility(order._id)}
              />
              <h2>Thông tin người nhận hàng</h2>
              <p>Tên người nhận: {order.name}</p>
              <p>Địa chỉ: {order?.shippingAddress}</p>
              <p>Số điện thoại: {order.phone}</p>
              <p>Trạng thái: {order.status}</p>
              <p>Thanh toán:{(order?.isPaid) ? " Đã thanh toán" : " Chưa thanh toán "}</p>
              <p>Mã đơn hàng: {order._id} </p>
              <h3 className="text-order">
                Chi tiết đơn hàng
                <span
                  style={{
                    fontSize: "16px",
                    color: "#d70018",
                    fontStyle: "italic"
                  }}
                >
                  {` (${order?.products?.length} sản phẩm)`}
                </span>
              </h3>

              {visibleOrders[order._id] && (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Hình sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.products?.map((item, itemIndex) => {
                        return (
                          <tr key={item?.productId?.id}>
                            <td>{itemIndex + 1}</td>
                            <td>
                              <img
                                src={item?.productId?.imageUrl}
                                alt={item?.productId?.productName}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "contain"
                                }}
                              />
                            </td>
                            <td>{item?.productId?.name}</td>
                            <td>
                              {" "}
                              {parseInt(item?.productId?.prices) ==
                                item?.productId?.promotionPrice ? (
                                <div className="grp-price">
                                  <p className="prices">
                                    {`${parseInt(
                                      item?.productId?.prices
                                    ).toLocaleString("vi-VN")} ₫`}
                                  </p>
                                </div>
                              ) : (
                                <div className="grp-price">
                                  <p className="price-old">
                                    {`${parseInt(
                                      item?.productId?.prices
                                    ).toLocaleString("vi-VN")} ₫`}
                                  </p>
                                  <div className="grp-price-new">
                                    <p className="price-new">
                                      {`${parseInt(
                                        item?.productId?.promotionPrice
                                      ).toLocaleString("vi-VN")}
                               ₫`}
                                    </p>
                                    <p className="discount">
                                      {`-${item?.productId?.discount}%`}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>{item?.quantity}</td>
                            <td
                              style={{
                                fontWeight: "bold",
                                color: "#5a8fc2",
                                fontSize: "16px"
                              }}
                            >
                              {(
                                item?.productId?.promotionPrice * item.quantity
                              ).toLocaleString("vi-VN")}
                              ₫
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="product-review-buttons">
                    <select
                      value={selectedProduct || ""}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn sản phẩm
                      </option>
                      {order?.products?.map((item) => {
                        return (
                          <option key={item?._id} value={item?.productId?._id}>
                            {item?.productId?.name}
                          </option>
                        );
                      })}
                    </select>
                    <button className="review-button" onClick={handleReview}>
                      Đánh giá
                    </button>
                  </div>
                </div>
              )}
              <div className="order-bottom">
                <h3>Chi tiết thanh toán</h3>
                <p>
                  Tổng tiền hàng:
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#5a8fc2",
                      fontSize: "16px"
                    }}
                  >
                    {order.totalPrice?.toLocaleString("vi-VN")} ₫
                  </span>
                </p>

                <p>
                  Chi phí vận chuyển:
                  <span>{order.shippingFee?.toLocaleString("vi-VN")} ₫</span>
                </p>

                <div style={{ borderTop: "solid 2px #ccc" }}>
                  <p>
                    Thành tiền:
                    <span
                      style={{
                        marginLeft: "10px",
                        fontWeight: "bold",
                        color: "#5a8fc2",
                        fontSize: "18px",
                        textAlign: "left"
                      }}
                    >
                      {parseInt(order?.orderTotal).toLocaleString("vi-VN")} ₫
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có đơn hàng nào đang xử lý.</p>
      )}
    </div>
  );
};

export default CancelledOrders;
