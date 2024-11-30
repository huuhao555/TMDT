// HomePage.jsx
import React, { useEffect, useState, memo } from "react";
import "./style.scss";
import CategorySlider from "../../../component/user/CategorySlide";
import CategoryComponent from "../../../component/user/category/category";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/product/getAllProduct"
        );
        if (!response.ok) throw new Error(response.statusText);

        const dataProducts = await response.json();
        setProducts(dataProducts.data);
        console.log(dataProducts);

        const uniqueCategories = [
          ...new Set(dataProducts.data.map((product) => product.category._id))
        ].map((id) => ({
          id,
          name: dataProducts.data.find((product) => product.category._id === id)
            .category.name
        }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <CategoryComponent />
          <div className="home-page">
            {categories.map((category) => {
              return (
                <CategorySlider
                  key={category.id}
                  categoryId={category.id}
                  products={products}
                  categoryName={category.name}
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
