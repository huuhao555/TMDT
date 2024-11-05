import { memo } from "react";
import "./style.scss";
import Courses from "../../component/products/products";
import CategoryComponent from "../../component/category/category";
const HomePage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <CategoryComponent />
        </div>
        <div className="col-lg-12">
          <Courses />
        </div>
      </div>
    </div>
  );
};
export default memo(HomePage);
