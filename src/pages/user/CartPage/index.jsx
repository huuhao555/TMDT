import "./style.scss";
import { RiDeleteBin5Line } from "react-icons/ri";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../../../middleware/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../router/path";
import { apiLink } from "../../../config/api";
import SuccessAnimation from "../../../component/general/Success";

const CartPage = () => {
  const [cart, setCart] = useState(null);

  const { user, updateCartCount } = useContext(UserContext);

  const [message, setMessage] = useState("")
  const [trigger, setTrigger] = useState(false)

  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigator = useNavigate();
  const { pathname } = useLocation();
  useEffect(
    () => {
      if (cart && cart.products) {
        const allProductIds = cart.products.map((item) => item?.productId._id);
        setSelectedProducts(allProductIds);
      }
      window.scrollTo(0, 0);
    },

    [cart],
    [pathname]
  );

  const getAllCart = useCallback(async () => {
    if (!user || !user.dataUser) return;
    const id = user.dataUser.id;
    try {
      const response = await fetch(apiLink + `/api/cart/get-cart/${id}`);
      if (!response.ok) throw new Error(response.statusText);
      const dataCart = await response.json();

      setCart(dataCart);
    } catch (error) {
      console.error("Failed to fetch count for users:", error);
    }
  }, [user]);

  useEffect(() => {
    getAllCart();
  }, [getAllCart]);
  const paymentCart = async (selectedProducts, userID) => {
    navigator(ROUTERS.USER.ORDER, {
      state: {
        selectedProducts
      }
    });
  };

  const removeFromCart = async (productId, userID) => {
    try {
      const response = await fetch(
        apiLink +
        `/api/cart/delete-product-cart/${userID}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      await getAllCart();
      setTrigger(true)
      setMessage("Xóa sản phẩm thành công");
      setTimeout(() => {
        setTrigger(false)
      }, 1000)

      const dataProduct = await response.json();
      
      updateCartCount(dataProduct.data.products.length);
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    }
  };

  const clearCart = async (userID) => {
    if (!window.confirm("Bạn có chắc chắn muốn giỏ hàng?")) {
      return;
    }
    try {
      const response = await fetch(
        apiLink + `/api/cart/delete-cart/${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      await response.json();
      setMessage("Xóa giỏ hàng thành công");
      setTrigger(true);
      setCart("");

      updateCartCount(0);
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    }
  };

  const handleIncrease = async ({ id }) => {
    if (!user) {
      alert("Vui lòng đăng nhập");
      return;
    }

    try {
      const response = await fetch(apiLink + "/api/cart/add-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.dataUser.id,
          productId: id,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const dataCart = await response.json();

      const updatedCount = dataCart.data.products.length;
      // updateCartCount(updatedCount);
      setCart(dataCart?.data);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleDecrease = async (id) => {
    try {
      const response = await fetch(apiLink + "/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.dataUser.id,
          productId: id,
          quantity: 1
        })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const dataCart = await response.json();

      const updatedCount = dataCart.data.products.length;
      // updateCartCount(updatedCount);
      setCart(dataCart?.data);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products
      .filter((item) => selectedProducts.includes(item?.productId._id))
      .reduce(
        (total, item) =>
          total + item?.productId?.promotionPrice * item?.quantity,
        0
      );
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="cart-page">
            {cart && cart.products.length > 0 ? (
              <div className="cart-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Chọn</th>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                      <th>Chức năng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.products.map((item, key) => {
                      return (
                        <tr key={item?._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(
                                item?.productId._id
                              )}
                              onChange={() =>
                                handleCheckboxChange(item?.productId._id)
                              }
                            />
                          </td>
                          <td>{key + 1}</td>
                          <td>{`${item?.productId.name}`}</td>
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

                          <td>
                            <div className="handle-quantity">
                              <span
                                onClick={() =>
                                  handleDecrease(item?.productId._id)
                                }
                                className="button-decrease"
                              >
                                –
                              </span>
                              <div>{item?.quantity}</div>
                              <span
                                onClick={() =>
                                  handleIncrease({
                                    id: item?.productId._id
                                  })
                                }
                                className="button-increase"
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              color: "#5a8fc2",
                              fontSize: "16px"
                            }}
                          >
                            {`${parseInt(
                              item?.productId?.promotionPrice * item?.quantity
                            ).toLocaleString("vi-VN")} ₫`}
                          </td>

                          <td>
                            <button
                              className="remove-button"
                              onClick={() =>
                                removeFromCart(
                                  item?.productId._id,
                                  user.dataUser.id
                                )
                              }
                            >
                              <RiDeleteBin5Line />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td
                        colSpan="1"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <input
                          style={{
                            marginRight: "5px",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            setSelectedProducts([]);
                          }}
                          type="checkbox"
                        />
                        <span style={{ cursor: "pointer" }}>Bỏ chọn</span>
                      </td>

                      <td
                        colSpan="4"
                        style={{ textAlign: "right", fontWeight: "bold" }}
                      >
                        Tổng tiền:
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "#5a8fc2",
                          fontSize: "18px"
                        }}
                      >
                        {parseInt(calculateTotal()).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  </tbody>
                </table>

                <button
                  className="clear-cart"
                  onClick={() => clearCart(user.dataUser.id)}
                >
                  Xoá giỏ hàng
                </button>
                <button
                  className="payment-cart"
                  onClick={() => {
                    paymentCart(selectedProducts, user.dataUser.id);
                  }}
                >
                  Thanh toán
                </button>
              </div>
            ) : (
              <p>Không có sản phẩm trong giỏ hàng.</p>
            )}
          </div>
        </div>
        <SuccessAnimation message={message} trigger={trigger} />
      </div>
    </div>
  );
};

export default CartPage;
