import { memo, useState } from "react";
import "./style.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ROUTERS } from "../../../../router/path";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../../../../config/api";

const SignUp = () => {
  const navigator = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiLink + "/api/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, confirmPassword, phone })
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const data = await response.json();

      navigator(ROUTERS.VERIFY_OTP, { state: { email } });

      // setName("");
      // setEmail("");
      // setPhone("");
      // setPassword("");
      // setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-9">
          <div style={{ width: "100%", height: "600px", overflow: "hidden" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/dacn-714e1.appspot.com/o/TMDT%2Fbca5a418bba3b32dd35b120c0027acf7.jpg?alt=media&token=fce2c395-f112-4adc-99b6-bac92910ccca"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Product"
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="register-container">
            <img
              src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/12/06090103/logo-shop-qu%E1%BA%A7n-%C3%A1o-8.png"
              alt="Logo"
              className="login-logo"
            />
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <input
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Phone"
                />
              </div>
              <div className="form-group password-signup">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
                <span
                  className="toggle-signup-password"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="form-group password-confirm-signup">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                />
                <span
                  className="toggle-signup-password"
                  onClick={togglePasswordConfirm}
                >
                  {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
            <div className="extra-links">
              <br />
              <a href="/dang-nhap">You have an account? Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SignUp);
