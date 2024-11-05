import { memo, useContext } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row">
        <header className="header-container">
          <div className="header-row">
            <div className="col-lg-3">
              <button className="logo" onClick={() => handleNavigate("/")}>
                T- Shirt N.14
              </button>
            </div>
            <div className="col-lg-6">
              <nav className="nav">
                <ul className="nav-list">
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/")}
                    >
                      Trang chủ
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/courses")}
                    >
                      Sản phẩm
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/contact")}
                    >
                      Danh mục sản phẩm
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/contact")}
                    >
                      Liên hệ
                    </button>
                  </li>
                  {user && (
                    <li className="nav-item">
                      <button
                        className="nav-link logout-button"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">
              {!user && (
                <div className="auth-buttons">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleNavigate(ROUTERS.LOGIN)}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleNavigate(ROUTERS.SIGNUP)}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default memo(Header);
