import { memo, useContext } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../router/path";
import { UserContext } from "../../../../middleware/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // updateUser(null);
    logout();
    navigate(ROUTERS.LOGIN);
  };
  const handleProfile = () => {
    navigate(ROUTERS.USERPROFILE.ACCOUNT_INFO);
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
                      onClick={() => handleNavigate("/courses")}
                    >
                      Áo nam
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/contact")}
                    >
                      Áo nữ
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/")}
                    >
                      Gia đình
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate("/")}
                    >
                      Cặp đôi
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate(ROUTERS.USER.CART)}
                    >
                      Giỏ hàng
                    </button>
                  </li>
                  {user && (
                    <li className="nav-item">
                      <button className="nav-link" onClick={handleProfile}>
                        Thông tin cá nhân
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
