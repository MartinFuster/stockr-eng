import React, { useState, useEffect } from "react";
import SaleRow from "./SaleRow";
import axios from "axios";
const _ = require("lodash");

function Sales() {
  const [products, setProducts] = useState([]);
  const [priceAmount, setPriceAmount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    axios
      .get("/sales")
      .then(function (res) {
        setProducts(res.data);
        setLoadingData(false);
        loadPrice(res.data);
      })
      .catch(function (err) {
        alert("There has been an error.");
      });

    function loadPrice(array) {
      let price = 0;
      array.forEach((product) => {
        price = parseFloat(product.total) + parseFloat(price);
      });
      setPriceAmount(price);
    }
  }, []);

  function removeFromArray(index) {
    let array = [...products];
    let price = 0;
    _.pullAt(array, [index]);
    setProducts([]);
    setProducts([...array]);
    array.forEach((product) => {
      price = parseFloat(product.total) + parseFloat(price);
    });
    setPriceAmount(price);
  }
  return (
    <div className="products">
      <div className="sidenav">
        <div className="box-links">
          <a href="/" className="box-container">
            <div className="box-content">
              <i class="fas fa-box-open nav-icon"></i>
              Products
            </div>
          </a>
          <a href="/ventas" className="box-container box-selected">
            <div className="box-content">
              <i class="fas fa-dollar-sign nav-icon icon-selected"></i>
              Sales
            </div>
          </a>
          <a href="/compras" className="box-container">
            <div className="box-content">
              <i class="fas fa-shopping-cart nav-icon"></i>
              Purchases
            </div>
          </a>
          <a href="/restock" className="box-container">
            <div className="box-content">
              <i class="fas fa-file-invoice-dollar nav-icon"></i>
              Restock
            </div>
          </a>
        </div>
      </div>
      <div className="main">
        <div className="nav">
          <div className="nav-content">
            <div className="section-remainder">
              <i class="fas fa-dollar-sign main-icon"></i>Sales
            </div>
            <div className="section-search">
              <div className="price-box">
                <div className="price-header">Total:</div>
                <div className="price">
                  {loadingData ? (
                    <i class="fas fa-spinner spinner"></i>
                  ) : (
                    "$" + priceAmount
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="form-container">
            {loadingData ? <i class="fas fa-spinner spinner"></i> : null}

            <div className="table">
              {products.length > 0 ? (
                <div className="tr">
                  <div className="th">ID</div>
                  <div className="th">Name</div>
                  <div className="th">Date</div>
                  <div className="th">Quantity</div>
                  <div className="th">Sale Per</div>
                  <div className="th">Total</div>
                </div>
              ) : !loadingData ? (
                <div className="info-text">
                  There is nothing around here. To see a sale register, you have
                  to sale a product in the products section.
                </div>
              ) : null}
              {products.map((object, i) => {
                return (
                  <SaleRow
                    object={object}
                    i={i}
                    key={i}
                    removeFromArray={removeFromArray}
                  />
                );
              })}
            </div>
          </div>
          <div className="mobile-navbar">
            <a href="/" className="anker-style">
              <div className="mobile-nav-link">
                <i class="fas fa-box-open mobile-nav-icon"></i>
              </div>
            </a>
            <a href="/ventas" className="anker-style">
              <div className="mobile-nav-link mobile-link-active">
                <i class="fas fa-dollar-sign mobile-nav-icon"></i>
              </div>
            </a>
            <a href="/compras" className="anker-style">
              <div className="mobile-nav-link">
                <i class="fas fa-shopping-cart mobile-nav-icon"></i>
              </div>
            </a>
            <a href="/restock" className="anker-style">
              <div className="mobile-nav-link">
                <i class="fas fa-file-invoice-dollar mobile-nav-icon"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales;
