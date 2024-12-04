import { memo, useState, useContext } from "react";
import "./style.scss";
import { ROUTERS } from "../../../../router/path";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../middleware/UserContext";
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiLink } from "../../../../config/api";

const Login = () => {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiLink + "/api/user/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data));
      updateUser(data);
      navigator(ROUTERS.USER.HOME);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container ">
      <div className="row">
        <div className="col-lg-9">
          <div style={{ width: "100%", height: "600px", overflow: "hidden" }}>
            <img
              src="https://i.pinimg.com/474x/d5/2d/db/d52ddbbe671bfe2f270f488632fbb1de.jpg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Product"
            />
          </div>
        </div>
        <div className="col-lg-3 login-wrap">
          <div className="login-container">
            <img
              src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/12/06090103/logo-shop-qu%E1%BA%A7n-%C3%A1o-8.png"
              alt="Logo"
              className="login-logo"
            />
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group password-group">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
            <div className="social-login">
              <p>Or login with:</p>
              <FaFacebook className="social-icon facebook" />
              <FaGoogle className="social-icon google" />
            </div>
            <div className="extra-links">
              <a href="/forgot-password">Forgot password?</a>
              <br />
              <a href="/dang-ky">Don't have an account? Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
