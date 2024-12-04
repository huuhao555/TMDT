import { memo, useState } from "react";
import "./style.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ROUTERS } from "../../../../router/path";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLink } from "../../../../config/api";

const VerifyOtp = () => {
  const navigator = useNavigate();
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  const { email } = location.state || {};

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiLink + "/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpToken })
      });

      if (!response.ok) {
        throw new Error("OTP failed");
      }
      const data = await response.json();
      navigator(ROUTERS.USER.LOGIN);
      alert("Verify successful");
      setOtpToken("");
    } catch (err) {
      setError(err.message);
    }
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
          <div className="verify-container">
            <img
              src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/12/06090103/logo-shop-qu%E1%BA%A7n-%C3%A1o-8.png"
              alt="Logo"
              className="verify-logo"
            />
            <h2>Verify OTP</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-verify-group">
                <input
                  type="text"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  required
                  placeholder="OTP"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VerifyOtp);
