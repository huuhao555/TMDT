import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import { ROUTERS } from "./router/path";
import MasterLayout from "./pages/user/theme/MasterLayout";
import Login from "./pages/user/auth/login";
import Signup from "./pages/user/auth/signup";
import AdminLayout from "./pages/admin/theme/AdminLayout/AdminLayout";
import Dashboard from "./component/admin/Dashboard";
import ProductList from "./component/admin/ProductList/ProductList";
import StaffManagement from "./component/admin/StaffManagement/StaffManagement";
import ProductManagement from "./component/admin/ProductManagement/ProductManagement";
import CreateProduct from "./component/admin/CreateProduct";
import RevenueStatistics from "./component/admin/RevenueStatistics";
import PurchaseHistory from "./component/admin/PurchaseHistory/PurchaseHistory";
import UpdateUser from "./pages/admin/auth/UpdateUser";
import UpdateProduct from "./component/admin/UpdateProduct";
import ProductTypeManagement from "./component/admin/ProductTypeManager";
import CartPage from "./pages/user/CartPage";
import CreateCategory from "./component/admin/CreateCategory";
const RouterCustom = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
        <Route path={ROUTERS.LOGIN} element={<Login />} />
        <Route path={ROUTERS.SIGNUP} element={<Signup />} />
        <Route path={ROUTERS.USER.CART} element={<CartPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path={ROUTERS.ADMIN.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTERS.ADMIN.PRODUCT_LIST} element={<ProductList />} />
        <Route
          path={ROUTERS.ADMIN.MANAGE_STAFF}
          element={<StaffManagement />}
        />
        <Route
          path={ROUTERS.ADMIN.MANAGE_PRODUCTS}
          element={<ProductManagement />}
        />
        <Route
          path={ROUTERS.ADMIN.CREATE_PRODUCT}
          element={<CreateProduct />}
        />
        <Route
          path={ROUTERS.ADMIN.CREATE_CATEGORY}
          element={<CreateCategory />}
        />
        <Route
          path={ROUTERS.ADMIN.REVENUE_STATS}
          element={<RevenueStatistics />}
        />
        <Route
          path={ROUTERS.ADMIN.PURCHASE_HISTORY}
          element={<PurchaseHistory />}
        />
        <Route
          path={ROUTERS.ADMIN.MANAGE_PRODUCT_TYPES}
          element={<ProductTypeManagement />}
        />
        <Route
          path={`${ROUTERS.ADMIN.UPDATE_USER}/:id`}
          element={<UpdateUser />}
        />
        {/* <Route path={ROUTERS.ADMIN.DELETE_USER} element={<DeleteUser />} /> */}
        <Route
          path={`${ROUTERS.ADMIN.UPDATE_PRODUCT}/:id`}
          element={<UpdateProduct />}
        />
      </Route>
    </Routes>
  );
};

export default RouterCustom;
