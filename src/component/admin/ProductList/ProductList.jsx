import React, { useEffect, useState } from "react";

import "./style.scss";
import { apiLink } from "../../../config/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();

        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-list-admin">
      {currentProducts.map((product) => (
        <div className="product-item-admin" key={product._id}>
          <div className="product-item-image-admin">
            <img
              className="add-to-img-admin"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
          <div className="product-item-bottom-admin">
            <div className="item-product-bottom-admin">
              <h3>{product.name}</h3>
              <div className="grp-price">
                {product?.prices == parseInt(product?.promotionPrice) ? (
                  <p className="price">
                    {parseInt(
                      parseInt(product?.promotionPrice)
                    )?.toLocaleString("vi-VN")}
                    ₫
                  </p>
                ) : (
                  <>
                    <p className="price-old">
                      {parseInt(product?.prices)?.toLocaleString("vi-VN")}
                      ₫
                    </p>
                    <div className="price-new">
                      <p className="price-discount">
                        {parseInt(
                          parseInt(product?.promotionPrice)
                        )?.toLocaleString("vi-VN")}
                        ₫
                      </p>
                      <p className="discount">{`-${product?.discount}%`}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="pagination-products-list">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`page-number ${currentPage === number + 1 ? "active" : ""
              }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
