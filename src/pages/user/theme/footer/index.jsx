import { memo } from "react";
import "./style.scss";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="row">
        <div className="col-xl-3 about-section">
          <h5>Giới thiệu</h5>
          <p>Trang bán quần áo T-Shirt bán chạy nhất ở Việt Nam</p>
        </div>
        <div className="col-xl-6 contact-section">
          <h5>Liên hệ</h5>
          <p>Email: tmdt.n14@tshirt.com</p>
          <p>Phone: +123-456-7890</p>
          <p>Address: TMDT N14 HVHKVN</p>
        </div>
        <div className="col-xl-3 social-section">
          <h5>Follow Us</h5>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon facebook">
              Facebook
            </a>
            <a href="https://twitter.com" className="social-icon twitter">
              Twitter
            </a>
            <a href="https://instagram.com" className="social-icon instagram">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} T-Shirt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default memo(Footer);
