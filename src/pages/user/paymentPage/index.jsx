import React from "react";
import "./style.scss";

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-status-icon">
          <i className="checkmark">✔️</i>
        </div>
        <h2>Payment Successful!</h2>
        <div className="payment-details">
          <div className="detail">
            <span>Amount</span>
            <span>$299.99</span>
          </div>
          <div className="detail">
            <span>Transaction Id</span>
            <span>TXN123456789</span>
          </div>
          <div className="detail">
            <span>Date</span>
            <span>11/12/2024, 9:34:23 PM</span>
          </div>
          <div className="detail">
            <span>Payment Method</span>
            <span>Credit Card (**** 1234)</span>
          </div>
        </div>
        <button className="done-button">DONE</button>
      </div>
    </div>
  );
};

export default PaymentPage;
