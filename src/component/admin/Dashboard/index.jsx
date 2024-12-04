import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import RevenueStatistics from "../RevenueStatistics";
import { ROUTERS } from ".././../../router/path.js";
import PurchaseHistory from "../PurchaseHistory/PurchaseHistory.jsx";
import { apiLink } from "../../../config/api.js";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await fetch(apiLink + "/api/order/total-revenue");
        if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");

        const data = await response.json();
        setTotalRevenue(data.totalRevenue);
      } catch (error) {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  const DashboardCard = ({ to, color, title, count, icon }) => (
    <Link to={to}>
      <div className={`card ${color}`}>
        <div className="card-content">
          <h3>{title}</h3>
          <p className="count">{count}</p>
        </div>
        <div className="icon">{icon}</div>
      </div>
    </Link>
  );

  const fetchCount = async (url, setCount) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setCount(data?.total || data?.data?.length || data?.totalReviews || 0);
    } catch (error) {
      console.error(`Lỗi khi fetch từ ${url}:`, error);
    }
  };

  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchCount(apiLink + "/api/user/getAllUser", setUserCount);
    fetchCount(apiLink + "/api/order/getAll", setOrderCount);
    fetchCount(apiLink + "/api/product/getAllProduct", setProductCount);
    fetchCount(apiLink + "/api/review/reviews/count", setReviewCount);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="total-revenue">{`Tổng Doanh Thu: ${parseInt(
        totalRevenue
      )?.toLocaleString("vi-VN")}  VNĐ`}</h1>
      <div className="dashboard-cards">
        <DashboardCard
          to={ROUTERS.ADMIN.MANAGE_STAFF}
          color="green"
          title="Tổng người dùng"
          count={userCount}
          icon="👤"
        />
        <DashboardCard
          to={ROUTERS.ADMIN.MANAGER_ORDER}
          color="purple"
          title="Tổng đơn hàng"
          count={orderCount}
          icon="🛒"
        />
        <DashboardCard
          to={ROUTERS.ADMIN.PRODUCT_LIST}
          color="blue"
          title="Tổng sản phẩm"
          count={productCount}
          icon="💻"
        />
        <DashboardCard
          to={ROUTERS.ADMIN.MANAGE_PRODUCTS}
          color="orange"
          title="Tổng đánh giá"
          count={reviewCount}
          icon="⭐"
        />
      </div>
      <div className="chart">
        <RevenueStatistics />
      </div>
      <div>
        <PurchaseHistory />
      </div>
    </div>
  );
};

export default Dashboard;
