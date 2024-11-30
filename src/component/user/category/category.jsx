import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../router/path";

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/category/getAll");
      const data = await response.json();
      setCategories(data.data);
      console.log(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="category-container">
            <div className="categories">
              {categories.map((category, index) => (
                <Link
                  to={`${ROUTERS.USER.PRODUCTS_BYCATEGORY}/${category.name}`}
                  state={{ id: category._id }}
                >
                  <div key={index} className="category-card">
                    <img
                      src={category.iconUrl}
                      alt={`${category.name} icon`}
                      className="category-icon"
                    />
                    <h3 className="category-name">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
