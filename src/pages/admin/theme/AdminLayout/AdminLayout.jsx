import { Outlet } from "react-router-dom";
import Sidebar from "../../../../component/admin/Sidebar/Sidebar.jsx";
import HeaderAdmin from "../header/header.jsx";
import { UserProvider } from "../../../../middleware/UserContext.js";
import { NotificationProvider } from "../../../../middleware/NotificationContext.js";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../component/general/LoadingSpinner/index.jsx";
import NotFoundPage from "../../../../component/general/NotFoundPage/index.jsx";
import { apiLink } from "../../../../config/api.js";
const AdminLayout = (props) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refresh_token");

    try {
      const response = await fetch(apiLink + "/api/user/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${storedRefreshToken}`
        }
      });

      if (!response.ok) throw new Error("Unable to refresh token");

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // window.location.href = "/";
      // localStorage.removeItem("user");
      // localStorage.removeItem("access_token");
      // localStorage.removeItem("refresh_token");
      return null;
    }
  };

  useEffect(() => {
    const initializeAuthorization = async () => {
      try {
        const storedAccessToken = localStorage.getItem("access_token");

        if (!storedAccessToken) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        const response = await fetch(apiLink + "/api/check/admin", {
          headers: {
            Authorization: `Bearer ${storedAccessToken}`
          }
        });

        if (response.ok) {
          setIsAuthorized(true);
        } else {
          const newToken = await refreshToken();
          if (newToken) {
            const retryResponse = await fetch(apiLink + "/api/check/admin", {
              headers: {
                Authorization: `Bearer ${newToken}`
              }
            });

            if (retryResponse.ok) {
              setIsAuthorized(true);
              return;
            }
          }

          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Lỗi xác thực:", error.message);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuthorization();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <NotFoundPage replace />;
  }
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
