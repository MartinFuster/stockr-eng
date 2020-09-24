import React, { useState, useEffect } from "react";
import ProductRow from "./ProductRow";
import { useSpring, animated } from "react-spring";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "./Error";
import axios from "axios";
const _ = require("lodash");

function Products() {
  let nameFound = false;
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [addProductActive, setAddProductActive] = useState(false);
  const [loadingCursor, setLoadingCursor] = useState(false);

  useEffect(() => {
    axios
      .get("/products")
      .then(function (res) {
        setDefaultProducts(res.data);
        setProducts(res.data);
        setLoadingData(false);
      })
      .catch(function (err) {
        alert("There has been an error.");
      });
  }, []);

  const productAnimation = useSpring({
    opacity: addProductActive ? 1 : 0,
    visibility: addProductActive ? "visible" : "hidden",
  });

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(1, "It has to contain a character.")
      .max(255, "The name is too long.")
      .test("isUsed", "The name is already in use.", () => {
        return !nameFound;
      })
      .required("Must enter a name."),
    cantidad: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a quantity."),
    costoCaja: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a cost."),
    costoUnitario: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a cost."),
    precioUnitario: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a price."),
    precioCaja: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a price."),
    precioParticular: Yup.number()
      .typeError("Must be a number")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a price."),
  });

  function removeFromArray(index) {
    let array = [...products];
    let arrayDefault = [...defaultProducts];
    _.pullAt(array, [index]);
    _.pullAt(arrayDefault, [index]);
    setProducts([]);
    setDefaultProducts([]);
    setDefaultProducts([...arrayDefault]);
    setProducts([...array]);
  }

  function updateNombre(index, name) {
    const array = products;
    _.set(array, "[" + index + "].nombre", name);
    setProducts([...array]);
  }

  function updateCantidad(index, cantidad) {
    const array = products;
    _.set(array, "[" + index + "].cantidad", cantidad);
    setProducts([...array]);
  }

  function updateCostoCaja(index, costoCaja) {
    const array = products;
    _.set(array, "[" + index + "].costoCaja", costoCaja);
    setProducts([...array]);
  }

  function updateCostoUnit(index, costoUnit) {
    const array = products;
    _.set(array, "[" + index + "].costoUnit", costoUnit);
    setProducts([...array]);
  }

  function updatePrecioUnit(index, precioUnit) {
    const array = products;
    _.set(array, "[" + index + "].precioUnit", precioUnit);
    setProducts([...array]);
  }

  function updatePrecioCaja(index, precioCaja) {
    const array = products;
    _.set(array, "[" + index + "].precioCaja", precioCaja);
    setProducts([...array]);
  }

  function updatePrecioPart(index, precioPart) {
    const array = products;
    _.set(array, "[" + index + "].precioPart", precioPart);
    setProducts([...array]);
  }

  function updateDefaultNombre(index, nombre) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].nombre", nombre);
    setDefaultProducts([...array]);
  }

  function updateDefaultCantidad(index, cantidad) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].cantidad", cantidad);
    setDefaultProducts([...array]);
  }

  function updateDefaultCostoCaja(index, costoCaja) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].costoCaja", costoCaja);
    setDefaultProducts([...array]);
  }

  function updateDefaultCostoUnit(index, costoUnit) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].costoUnit", costoUnit);
    setDefaultProducts([...array]);
  }

  function updateDefaultPrecioUnit(index, precioUnit) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].precioUnit", precioUnit);
    setDefaultProducts([...array]);
  }

  function updateDefaultPrecioCaja(index, precioCaja) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].precioCaja", precioCaja);
    setDefaultProducts([...array]);
  }

  function updateDefaultPrecioPart(index, precioPart) {
    const array = defaultProducts;
    _.set(array, "[" + index + "].precioPart", precioPart);
    setDefaultProducts([...array]);
  }

  function loadingCursorTrue() {
    setLoadingCursor(true);
  }

  function loadingCursorFalse() {
    setLoadingCursor(false);
  }

  return (
    <section className={loadingCursor ? "products loading-cursor" : "products"}>
      <animated.div className="poppup" style={productAnimation}>
        <div
          className="dark-bg"
          onClick={() => setAddProductActive(false)}
        ></div>
        <div className="poppup-add-product">
          <div
            className="poppup-close"
            onClick={() => setAddProductActive(false)}
          >
            <i class="fas fa-times"></i>
          </div>
          <div className="highlight-text">Add Product</div>
          <Formik
            initialValues={{
              nombre: "",
              cantidad: "",
              costoCaja: "",
              costoUnitario: "",
              precioUnitario: "",
              precioCaja: "",
              precioParticular: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              let nombre = values.nombre;

              nombre =
                nombre.toLowerCase().charAt(0).toUpperCase() +
                nombre.toLowerCase().slice(1);
              const cantidad = parseInt(values.cantidad);
              const costoCaja = parseFloat(values.costoCaja).toFixed(2);
              const costoUnitario = parseFloat(values.costoUnitario).toFixed(2);
              const precioUnitario = parseFloat(values.precioUnitario).toFixed(
                2
              );
              const precioCaja = parseFloat(values.precioCaja).toFixed(2);
              const precioParticular = parseFloat(
                values.precioParticular
              ).toFixed(2);
              products.some((product) => {
                if (product.nombre === nombre) {
                  nameFound = true;
                  const nombreObj = document.getElementById("nombre");
                  nombreObj.focus();
                  nombreObj.blur();
                  setSubmitting(false);
                }
                return nameFound;
              });

              if (!nameFound) {
                const newProduct = {
                  nombre: nombre,
                  cantidad: cantidad,
                  costoCaja: costoCaja,
                  costoUnit: costoUnitario,
                  precioUnit: precioUnitario,
                  precioCaja: precioCaja,
                  precioPart: precioParticular,
                };
                const productsToPush = [...products, newProduct];
                const defaultProductsToPush = [...defaultProducts, newProduct];
                axios
                  .post("/products", newProduct)
                  .then(function (res) {
                    setProducts([]);
                    setDefaultProducts([]);
                    setDefaultProducts(defaultProductsToPush);
                    setProducts(productsToPush);
                    setSubmitting(false);
                    setAddProductActive(false);
                  })
                  .catch(function (err) {
                    setSubmitting(false);
                    resetForm();
                    setAddProductActive(false);
                    alert("There has been an error.");
                  });

                //
                //
                //
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form action="post" onSubmit={handleSubmit}>
                <div className="poppup-form-box">
                  <div className="text-small">Enter the name</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Nombre"
                    className={
                      touched.nombre && errors.nombre
                        ? "poppup-input has-error"
                        : touched.nombre && !errors.nombre
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onClick={() => {
                      nameFound = false;
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nombre}
                  />
                </div>
                <Error touched={touched.nombre} message={errors.nombre} />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the quantity</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="cantidad"
                    id="cantidad"
                    placeholder="Cantidad"
                    className={
                      touched.cantidad && errors.cantidad
                        ? "poppup-input has-error"
                        : touched.cantidad && !errors.cantidad
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cantidad}
                  />
                </div>
                <Error touched={touched.cantidad} message={errors.cantidad} />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the cost per stack</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="costoCaja"
                    id="costoCaja"
                    placeholder="Costo por caja"
                    className={
                      touched.costoCaja && errors.costoCaja
                        ? "poppup-input has-error"
                        : touched.costoCaja && !errors.costoCaja
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.costoCaja}
                  />
                </div>
                <Error touched={touched.costoCaja} message={errors.costoCaja} />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the cost per unit</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="costoUnitario"
                    id="costoUnitario"
                    placeholder="Costo unitario"
                    className={
                      touched.costoUnitario && errors.costoUnitario
                        ? "poppup-input has-error"
                        : touched.costoUnitario && !errors.costoUnitario
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.costoUnitario}
                  />
                </div>
                <Error
                  touched={touched.costoUnitario}
                  message={errors.costoUnitario}
                />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the price per stack</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="precioCaja"
                    id="precioCaja"
                    placeholder="Precio por caja"
                    className={
                      touched.precioCaja && errors.precioCaja
                        ? "poppup-input has-error"
                        : touched.precioCaja && !errors.precioCaja
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.precioCaja}
                  />
                </div>
                <Error
                  touched={touched.precioCaja}
                  message={errors.precioCaja}
                />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the price per unit</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="precioUnitario"
                    id="precioUnitario"
                    placeholder="Precio unitario"
                    className={
                      touched.precioUnitario && errors.precioUnitario
                        ? "poppup-input has-error"
                        : touched.precioUnitario && !errors.precioUnitario
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.precioUnitario}
                  />
                </div>
                <Error
                  touched={touched.precioUnitario}
                  message={errors.precioUnitario}
                />
                <div className="poppup-form-box">
                  <div className="text-small">Enter the particular price</div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="precioParticular"
                    id="precioParticular"
                    placeholder="Precio Particular"
                    className={
                      touched.precioParticular && errors.precioParticular
                        ? "poppup-input has-error"
                        : touched.precioParticular && !errors.precioParticular
                        ? "poppup-input hasnt-error"
                        : "poppup-input"
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.precioParticular}
                  />
                </div>
                <Error
                  touched={touched.precioParticular}
                  message={errors.precioParticular}
                />
                <div className="poppup-form-box">
                  <button
                    type="submit"
                    className="btn btn-main btn-poppup u-margin-bottom-big"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="loading-container">
                        Adding Product{" "}
                        <i class="fas fa-spinner spinner spinner-btn"></i>
                      </div>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </animated.div>
      <div className="sidenav">
        <div className="box-links">
          <a href="/" className="box-container box-selected">
            <div className="box-content">
              <i class="fas fa-box-open nav-icon icon-selected"></i>
              Products
            </div>
          </a>
          <a href="/ventas" className="box-container">
            <div className="box-content">
              <i class="fas fa-dollar-sign nav-icon"></i>
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
              <i class="fas fa-box-open main-icon"></i>Products
            </div>
            <div className="section-search">
              <input
                type="text"
                className="search-bar"
                placeholder="Search by name"
                onChange={(e) => {
                  let newSearchKeyword =
                    e.target.value.toLowerCase().charAt(0).toUpperCase() +
                    e.target.value.toLowerCase().slice(1);
                  setSearchWords(newSearchKeyword);
                }}
              />
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="form-container">
            <div className="table">
              {products.length > 0 ? (
                <div className="tr">
                  <div className="th">Name</div>
                  <div className="th">Quantity</div>
                  <div className="th">Cost/Stack</div>
                  <div className="th">Cost/Unit</div>
                  <div className="th">Price/Unit</div>
                  <div className="th">Price/Stack</div>
                  <div className="th">Price/Part</div>
                </div>
              ) : null}
              {products.map((object, i) => {
                if (object.nombre.includes(searchWords)) {
                  return (
                    <ProductRow
                      object={object}
                      i={i}
                      key={i}
                      defaultProducts={defaultProducts[i]}
                      defaultProductsArray={defaultProducts}
                      removeFromArray={removeFromArray}
                      updateNombre={updateNombre}
                      updateDefaultNombre={updateDefaultNombre}
                      updateCantidad={updateCantidad}
                      updateDefaultCantidad={updateDefaultCantidad}
                      updateCostoCaja={updateCostoCaja}
                      updateDefaultCostoCaja={updateDefaultCostoCaja}
                      updateCostoUnit={updateCostoUnit}
                      updateDefaultCostoUnit={updateDefaultCostoUnit}
                      updatePrecioUnit={updatePrecioUnit}
                      updateDefaultPrecioUnit={updateDefaultPrecioUnit}
                      updatePrecioCaja={updatePrecioCaja}
                      updateDefaultPrecioCaja={updateDefaultPrecioCaja}
                      updatePrecioPart={updatePrecioPart}
                      updateDefaultPrecioPart={updateDefaultPrecioPart}
                      loadingCursorTrue={loadingCursorTrue}
                      loadingCursorFalse={loadingCursorFalse}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </div>
            {loadingData ? (
              <i class="fas fa-spinner spinner"></i>
            ) : (
              <button
                className="btn btn-main"
                onClick={() => {
                  setAddProductActive(true);
                }}
              >
                Add Product<i class="fas fa-plus plus-icon"></i>
              </button>
            )}
          </div>
          <div className="mobile-navbar">
            <a href="/" className="anker-style">
              <div className="mobile-nav-link mobile-link-active">
                <i class="fas fa-box-open mobile-nav-icon"></i>
              </div>
            </a>
            <a href="/ventas" className="anker-style">
              <div className="mobile-nav-link">
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
    </section>
  );
}

export default Products;
