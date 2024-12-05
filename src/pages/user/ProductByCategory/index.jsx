import { memo, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { ROUTERS } from "../../../router/path";
import { UserContext } from "../../../middleware/UserContext";
import Notification, {
  NotificationContainer
} from "../../../component/user/Notification";
import { apiLink } from "../../../config/api";

const ProductByCategory = () => {
  const { notifications, addNotification } = NotificationContainer();

  const { user } = useContext(UserContext) || {};

  const location = useLocation();
  const dataId = location.state || {};

  const [products, setProducts] = useState([]);
  const [productsAll, setProductsAll] = useState(products);
  const sorts = [
    "Mới nhất",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Đang giảm giá"
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        if (!response.ok) throw new Error(response.statusText);

        const dataProducts = await response.json();

        let filteredProducts;

        if (dataId?.id === "discount") {
          filteredProducts = dataProducts.data.filter(
            (product) => product.discount > 0
          );
        } else {
          filteredProducts = dataProducts.data.filter(
            (product) => product.category === dataId.id
          );
        }

        setProducts(filteredProducts);
        setProductsAll(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [dataId.id]);

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(apiLink + "/api/cart/add-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.dataUser?.id,
          productId: product?._id,
          quantity: 1,
          prices: product?.promotionPrice
        })
      });
      if (!response.ok) throw new Error("Failed to add product to cart");

      addNotification("Thêm giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
    }
  };
  const handleTagClick = (key) => {
    if (activeTag === key) {
      setActiveTag(null);
      setProducts(productsAll);
    } else {
      setActiveTag(key);
      Sort(key);
    }
  };
  const [dataChange, setDataChange] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const handleOptionMin = (e) => {
    setPriceMin(e.target.value);
  };
  const handleOptionMax = (e) => {
    setPriceMax(e.target.value);
  };
  const Search = (e) => {
    const valueInputSearch = e.target.value.toLowerCase();
    if (valueInputSearch === "") {
      setProducts(productsAll);
      setSuggestions([]);
      return;
    }
    const searchProducts = productsAll.filter((product) => {
      return product?.name?.toLowerCase().includes(valueInputSearch);
    }, []);
    setProducts(searchProducts);
    setSuggestions(searchProducts);
    setDataChange(searchProducts);
  };
  const handlePriceRange = () => {
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    if (min === 0 && max === 0) {
      setDataChange(productsAll);
      setProducts(productsAll);
    } else {
      const dataNewSearchPrice = productsAll.filter((item) => {
        const price = parseFloat(item.promotionPrice);

        if (min > 0 && max > 0) {
          return price >= min && price <= max;
        } else if (min > 0) {
          return price >= min;
        } else if (max > 0) {
          return price <= max;
        }
        return true;
      });

      if (dataNewSearchPrice.length === 0) {
        setDataChange([]);
        setProducts([]);
      } else {
        setDataChange(dataNewSearchPrice);
        setProducts(dataNewSearchPrice);
      }

      return dataNewSearchPrice;
    }
  };
  const Sort = (key) => {
    let dataNewSort = [...(dataChange.length > 0 ? dataChange : productsAll)];
    switch (key) {
      case 0:
        dataNewSort.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 1:
        dataNewSort.sort((a, b) => a.promotionPrice - b.promotionPrice);
        break;
      case 2:
        dataNewSort.sort((a, b) => b.promotionPrice - a.promotionPrice);
        break;
      case 3:
        dataNewSort = dataNewSort
          .filter((item) => item.discount > 0)
          .sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setProducts(dataNewSort);
    setDataChange(dataNewSort);
  };
  const clearSidebar = () => {
    setProducts(productsAll);

    setPriceMin("");
    setPriceMax("");
    setDataChange([]);
    setSuggestions([]);
    setActiveTag(null);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3">
          <div className="sidebar">
            <div className="sidebar-item sidebar-item-search">
              <div className="top-sidebar-item">
                <h3>Tìm kiếm</h3>
                <AiOutlineClose className="icon-close" onClick={clearSidebar} />
              </div>
              <input type="text" onChange={Search} />
              <div className="suggestions">
                {suggestions.map((item, key) => {
                  return (
                    <Link
                      to={`${ROUTERS.USER.DETAILS}/${item?._id}`}
                      state={item}
                      style={{ width: "100%" }}
                    >
                      <div key={key} className="suggestion-item">
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="sidebar-item">
              <h3> Mức Giá</h3>
              <div className="price-range-wrap">
                <div>
                  <p>Từ </p>
                  <select
                    onChange={handleOptionMin}
                    className="optionPrice"
                    value={priceMin}
                  >
                    <option value="0">---Chọn---</option>
                    <option value="100000">100.000</option>
                    <option value="200000">200.000</option>
                    <option value="300000">300.000</option>
                    <option value="400000">400.000</option>
                    <option value="500000">500.000</option>
                    <option value="600000">600.000</option>
                    <option value="700000">700.000</option>
                  </select>
                  <input
                    type="number"
                    value={priceMin || ""}
                    min={0}
                    onChange={(e) => {
                      setPriceMin(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <p>Đến</p>
                  <select
                    onChange={handleOptionMax}
                    className="optionPrice"
                    value={priceMax}
                  >
                    <option value="0">---Chọn---</option>
                    <option value="100000">100.000</option>
                    <option value="200000">200.000</option>
                    <option value="300000">300.000</option>
                    <option value="400000">400.000</option>
                    <option value="500000">500.000</option>
                    <option value="600000">600.000</option>
                    <option value="700000">700.000</option>
                  </select>
                  <input
                    type="number"
                    value={priceMax || ""}
                    min={0}
                    onChange={(e) => {
                      setPriceMax(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <AiOutlineSearch
                    onClick={handlePriceRange}
                    className="icon-search"
                  />
                </div>
              </div>
            </div>
            <div className="sidebar-item">
              <h3>Sắp xếp</h3>
              <div className="tags">
                {sorts.map((item, key) => (
                  <div
                    className={`tag ${activeTag === key ? "active" : ""}`}
                    key={key}
                    onClick={() => handleTagClick(key)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="container-product">
            {products.length > 0 ? (
              <div className="grid">
                {products.map((product) => (
                  <div key={product?._id} className="card">
                    <Link
                      to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                      state={product}
                    >
                      <img
                        src={product?.imageUrl}
                        alt={product?.name}
                        className="image"
                      />
                      <div className="info">
                        <h3 className="name">{product?.name}</h3>
                        <div className="grp-price">
                          {product?.prices ==
                          parseInt(product?.promotionPrice) ? (
                            <p className="price">
                              {parseInt(
                                parseInt(product?.promotionPrice)
                              )?.toLocaleString("vi-VN")}
                              ₫
                            </p>
                          ) : (
                            <>
                              <p className="price-old">
                                {parseInt(product?.prices)?.toLocaleString(
                                  "vi-VN"
                                )}
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
                    </Link>
                    <button
                      className="add-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Không có sản phẩm nào!</p>
            )}
          </div>
        </div>
      </div>
      <div className="notifications-wrapper">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProductByCategory);
