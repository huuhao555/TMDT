import { memo } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { BiDoorOpen } from "react-icons/bi";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <>
      <div className="header-main-admin">
        <div className="container-fixed-admin ">
          <div className="row">
            <div className="col-xl-3">
              <div className="header-logo"></div>
            </div>
            <div className="col-xl-6"></div>
            <div className="col-xl-3">
              <div onClick={handleLogout} className="log-out">
                <BiDoorOpen />
                Thoát
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(HeaderAdmin);
