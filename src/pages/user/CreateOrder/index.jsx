import "./style.scss";
import { useState, useEffect, useCallback, useContext } from "react";
import { CartContext } from "../../../middleware/CartContext";
import {
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaApplePay,
  FaGooglePay
} from "react-icons/fa";
import { UserContext } from "../../../middleware/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../router/path";
const CreateOrderPage = (state) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const navigator = useNavigate();
  const location = useLocation();
  const { selectedProducts } = location.state || {};

  const { user } = useContext(UserContext) || {};

  const [dataOrder, setDataOrder] = useState(null);
  const [cart, setCart] = useState(null);
  const getAllCart = useCallback(async () => {
    if (!user || !user.dataUser) return;
    const id = user.dataUser.id;
    try {
      const response = await fetch(
        `http://localhost:8001/api/cart/get-cart/${id}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      const filteredData = data.products.filter((product) =>
        selectedProducts.includes(product.productId._id)
      );

      setDataOrder({ ...data, products: filteredData });
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  }, [user]);

  useEffect(() => {
    getAllCart();
  }, [getAllCart]);

  const totalPrice = dataOrder
    ? dataOrder.products.reduce(
        (acc, item) => acc + item.productId.prices * item.quantity,
        0
      )
    : 0;
  const shippingCost = totalPrice && totalPrice > 500000 ? 0 : 50000;
  const grandTotal = totalPrice + shippingCost;
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: user?.dataUser?.name || "",
    phone: user?.dataUser?.phone || "",
    email: user?.dataUser?.email || "",
    address: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    if (name === "address") {
      fetchSuggestions(value);
    }
  };
  const handleSelectSuggestion = (suggestion) => {
    setPaymentDetails({ ...paymentDetails, address: suggestion.description });
    setSuggestions([]);
  };
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=YAAkQr05IwPk9mIFw3zTv9FE0LX4cJ1wryk77Bfb&input=${query}`
      );
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };
  const [orderId, setOrderId] = useState();

  const handlePayment = async () => {
    if (window.confirm("Bạn có chắc chắn đặt hàng không?")) {
      try {
        const response = await fetch("http://localhost:8001/api/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: paymentDetails.cardName,
            phone: paymentDetails.phone,
            email: paymentDetails.email,
            userId: user.dataUser.id,
            cartId: dataOrder._id,
            shippingAddress: {
              address: paymentDetails.address
            },
            productIds: selectedProducts
          })
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setOrderId(data.data._id);
      } catch (error) {
        alert("Đặt hàng thất bại");
      }
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const createPayment = async () => {
      try {
        const returnUrl = "http://localhost:8000/ket-qua-thanh-toan";
        const response = await fetch(
          "http://localhost:8001/api/payments/create_payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderId,
              returnUrl
            })
          }
        );

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data.paymentURL);
        if (data?.paymentURL) {
          window.location.href = data.paymentURL;
        } else {
          console.error("Không tìm thấy URL thanh toán.");
        }
      } catch (error) {
        console.error("Failed to create payment:", error);
      }
    };

    createPayment();
  }, [orderId]);
  const [suggestions, setSuggestions] = useState([]);

  return (
    <div className="container-create-order">
      <div className="row-create-order">
        <div className="payment-page">
          <div className="payment-form">
            <h2>Thông tin đặt hàng</h2>

            <input
              type="text"
              name="cardName"
              placeholder="Tên người nhận "
              value={paymentDetails.cardName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại "
              value={paymentDetails.phone}
              onChange={handleInputChange}
              maxLength="10"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={paymentDetails.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ nhận hàng"
              value={paymentDetails.address}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="address-suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="order-summary">
            <h2>Thông tin đơn hàng</h2>
            {dataOrder &&
            dataOrder.products &&
            dataOrder.products.length > 0 ? (
              <div className="order-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataOrder.products.map((item, key) => (
                      <tr key={item._id}>
                        <td>{key + 1}</td>
                        <td>{item.productId.name}</td>
                        <td>
                          {item.productId.prices.toLocaleString("vi-VN")} VNĐ
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {(
                            item.productId.prices * item.quantity
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan="3" style={{ textAlign: "right" }}>
                        Tổng tiền hàng:
                      </td>
                      <td colSpan="2" style={{ textAlign: "right" }}>
                        {totalPrice.toLocaleString("vi-VN")} VNĐ
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="3" style={{ textAlign: "right" }}>
                        Chi phí vận chuyển:
                      </td>
                      <td colSpan="2" style={{ textAlign: "right" }}>
                        {shippingCost.toLocaleString("vi-VN")} VNĐ
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="3" style={{ textAlign: "right" }}>
                        Tổng tiền:
                      </td>
                      <td
                        colSpan="2"
                        style={{ textAlign: "right", fontWeight: "bold" }}
                      >
                        {grandTotal.toLocaleString("vi-VN")} VNĐ
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="complete-payment" onClick={handlePayment}>
                  Thanh toán
                </button>
              </div>
            ) : (
              <p>Không có sản phẩm trong giỏ hàng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
