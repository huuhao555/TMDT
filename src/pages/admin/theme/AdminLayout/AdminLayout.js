import { Outlet } from "react-router-dom";
import Sidebar from "../../../../component/admin/Sidebar/Sidebar";
import HeaderAdmin from "../header/header.jsx";
import { UserProvider } from "../../../../middleware/UserContext.js";
import { NotificationProvider } from "../../../../middleware/NotificationContext.js";
const AdminLayout = (props) => {
  return (
    <UserProvider>
      <NotificationProvider>
        <div {...props} className="container-layout">
          <HeaderAdmin />
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9 main-content">
              <Outlet />
            </div>
          </div>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
};

export default AdminLayout;
