// HomePage.jsx
import React, { useEffect, useState, memo } from "react";
import "./style.scss";
import CategorySlider from "../../../component/user/CategorySlide";
import CategoryComponent from "../../../component/user/category/category";
import ProductsPromotionComponent from "../../../component/user/productPromotion";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/category/getAll");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8001/api/product/getAllProduct"
      );
      if (!response.ok) throw new Error(response.statusText);

      const dataProducts = await response.json();

      setProducts(dataProducts.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <CategoryComponent />
          <div>
            <ProductsPromotionComponent />
          </div>
          <div className="home-page">
            {categories.map((category, key) => {
              console.log(category);
              return (
                <CategorySlider
                  key={key}
                  categoryId={category?._id}
                  products={products}
                  categoryName={category?.name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
