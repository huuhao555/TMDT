import { memo, useContext, useEffect, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../router/path";
import { UserContext } from "../../../../middleware/UserContext";
import logo from "../../../../assets/images/Clean.svg";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  const [categories, setCategories] = useState([]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/category/getAll");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row">
        <header className="header-container">
          <div className="header-row">
            <div className="col-lg-3">
              <img
                className="logo"
                src={logo}
                alt="Logo"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
            <div className="col-lg-6">
              <nav className="nav">
                <ul className="nav-list">
                  <li className="nav-item dropdown">
                    <span className="nav-link">Danh mục sản phẩm</span>
                    <ul className="dropdown-menu">
                      {categories.map((category) => (
                        <li key={category._id} className="dropdown-item">
                          <Link
                            to={`${ROUTERS.USER.PRODUCTS_BYCATEGORY}/${category.name}`}
                            state={{ id: category._id }}
                            className="dropdown-link"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate(ROUTERS.USER.CART)}
                    >
                      Giỏ hàng
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => handleNavigate(ROUTERS.USER.ORDERLOOKUP)}
                    >
                      Tra cứu
                    </button>
                  </li>
                  {user && (
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        onClick={() =>
                          handleNavigate(ROUTERS.USERPROFILE.ACCOUNT_INFO)
                        }
                      >
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
