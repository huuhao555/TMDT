import React, { useContext, useState } from "react";
import PendingOrders from "./PendingOrders";
import ShippingOrders from "./ShippingOrders";
import DeliveredOrders from "./DeliveredOrders";
import CancelledOrders from "./CancelledOrders";
import "./style.scss";
import UserContext from "../../../../middleware/UserContext";

const OrderStorage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { user } = useContext(UserContext) || {};

  const renderTabContent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingOrders />;
      case "shipping":
        return <ShippingOrders />;
      case "delivered":
        return <DeliveredOrders />;
      case "cancelled":
        return <CancelledOrders />;
      default:
        return null;
    }
  };

  const getLineClass = (tab) => {
    return activeTab === tab ? "active-line" : "";
  };

  return (
    <div className="order-status-page">
      <div className="tabs">
        <div className="status-indicator">
          <div onClick={() => setActiveTab("pending")}>
            <div className={`status-text ${getLineClass("pending")}`}>
              Đang xử lý
            </div>
          </div>

          <div onClick={() => setActiveTab("shipping")}>
            <div className={`status-text ${getLineClass("shipping")}`}>
              Đang giao
            </div>
          </div>

          <div onClick={() => setActiveTab("delivered")}>
            <div className={`status-text ${getLineClass("delivered")}`}>
              Đã giao
            </div>
          </div>

          <div onClick={() => setActiveTab("cancelled")}>
            <div className={`status-text ${getLineClass("cancelled")}`}>
              Đã huỷ
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default OrderStorage;
