import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../../router/path";

function Sidebar() {
  const [isProductManagementOpen, setProductManagementOpen] = useState(false);
  const [isProductCreateOpen, setProductCreateOpen] = useState(false);

  const toggleProductManagement = () => {
    setProductManagementOpen(!isProductManagementOpen);
  };
  const toggleCreateProduct = () => {
    setProductCreateOpen(!isProductCreateOpen);
  };
  return (
    <div className="sidebar-admin">
      <ul>
        <li>
          <Link to={ROUTERS.ADMIN.DASHBOARD}>Trang chủ</Link>
        </li>
        <li>
          <button className="toggle-button" onClick={toggleCreateProduct}>
            Thêm
          </button>
          {isProductCreateOpen && (
            <ul className="submenu">
              <li>
                <Link to={ROUTERS.ADMIN.CREATE_PRODUCT}>Thêm sản phẩm</Link>
              </li>
              <li>
                <Link to={ROUTERS.ADMIN.s}>Thêm loại sản phẩm</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.PRODUCT_LIST}>Danh sách sản phẩm</Link>
        </li>

        {/* Quản lý sản phẩm */}
        <li>
          <button className="toggle-button" onClick={toggleProductManagement}>
            Quản lý
          </button>
          {isProductManagementOpen && (
            <ul className="submenu">
              <li>
                <Link to={ROUTERS.ADMIN.MANAGE_PRODUCTS}>Quản lý sản phẩm</Link>
              </li>
              <li>
                <Link to={ROUTERS.ADMIN.MANAGE_PRODUCT_TYPES}>
                  Quản lý loại sản phẩm
                </Link>
              </li>
              <li>
                <Link to={ROUTERS.ADMIN.MANAGE_PRODUCT_DETAILS}>
                  Quản lý chi tiết sản phẩm
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to={ROUTERS.ADMIN.MANAGE_STAFF}>Quản lý nhân sự</Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.REVENUE_STATS}>Thống kê doanh thu</Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.PURCHASE_HISTORY}>Lịch sử</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
