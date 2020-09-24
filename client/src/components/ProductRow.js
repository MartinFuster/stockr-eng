import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { Formik } from "formik";
import Error from "./Error";
import * as Yup from "yup";
import axios from "axios";

function ProductRow(props) {
  const [nombre, setNombre] = useState(props.object.nombre);
  const [cantidad, setCantidad] = useState(props.object.cantidad);
  const [costoCaja, setCostoCaja] = useState(props.object.costoCaja);
  const [costoUnit, setCostoUnit] = useState(props.object.costoUnit);
  const [precioUnit, setPrecioUnit] = useState(props.object.precioUnit);
  const [precioCaja, setPrecioCaja] = useState(props.object.precioCaja);
  const [precioPart, setPrecioPart] = useState(props.object.precioPart);

  const [nombreDefault, setNombreDefault] = useState(
    props.defaultProducts.nombre
  );
  const [cantidadDefault, setCantidadDefault] = useState(
    props.defaultProducts.cantidad
  );
  const [costoCajaDefault, setCostoCajaDefault] = useState(
    props.defaultProducts.costoCaja
  );
  const [costoUnitDefault, setCostoUnitDefault] = useState(
    props.defaultProducts.costoUnit
  );
  const [precioUnitDefault, setPrecioUnitDefault] = useState(
    props.defaultProducts.precioUnit
  );
  const [precioCajaDefault, setPrecioCajaDefault] = useState(
    props.defaultProducts.precioCaja
  );
  const [precioPartDefault, setPrecioPartDefault] = useState(
    props.defaultProducts.precioPart
  );

  const [sellActive, setSellActive] = useState(false);
  const [noSaveWarning, setNoSaveWarning] = useState(false);
  const [qtyErr, setQtyErr] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const productAnimation = useSpring({
    opacity: sellActive ? 1 : 0,
    visibility: sellActive ? "visible" : "hidden",
  });

  const noSaveWarningAnimation = useSpring({
    opacity: noSaveWarning ? 1 : 0,
    visibility: noSaveWarning ? "visible" : "hidden",
  });

  const deleteWarningAnimation = useSpring({
    opacity: deleteWarning ? 1 : 0,
    visibility: deleteWarning ? "visible" : "hidden",
  });

  const validationSchema = Yup.object().shape({
    cantidadVendida: Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .test("qty", "There is not enough quantity in stock.", () => {
        return !qtyErr;
      })
      .positive("Must be positive.")
      .required("Must enter a quantity."),
  });

  function handleDelete() {
    setLoadingDelete(true);
    const data = {
      nombre: props.object.nombre,
      id: props.i,
    };
    axios
      .post("/products-delete", data)
      .then(function (res) {
        props.removeFromArray(props.i);
        setLoadingDelete(false);
        setDeleteWarning(false);
      })
      .catch(function (err) {
        alert("There has been an error.");
        setLoadingDelete(false);
        setDeleteWarning(false);
      });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSavingChanges(true);
    props.loadingCursorTrue();
    let errors = false;

    let nameSchema = Yup.string()
      .min(1, "Must contain a character.")
      .max(255, "The name is too long.")
      .required("Must enter a name.");

    let cantidadSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive.")
      .required("Must enter a quantity.");

    let costoCajaSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive")
      .required("Must enter a cost.");

    let costoUnitSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive")
      .required("Must enter a cost.");

    let precioUnitSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive")
      .required("Must enter a price.");

    let precioCajaSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive")
      .required("Must enter a price.");

    let precioPartSchema = Yup.number()
      .typeError("Must be a number.")
      .min(1, "Must contain a character.")
      .positive("Must be positive")
      .required("Must enter a price.");

    let nombreValid = await nameSchema.isValid(nombre);
    let cantidadValid = await cantidadSchema.isValid(cantidad);
    let costoCajaValid = await costoCajaSchema.isValid(costoCaja);
    let costoUnitValid = await costoUnitSchema.isValid(costoUnit);
    let precioUnitValid = await precioUnitSchema.isValid(precioUnit);
    let precioCajaValid = await precioCajaSchema.isValid(precioCaja);
    let precioPartValid = await precioPartSchema.isValid(precioPart);

    if (!nombreValid) {
      errors = true;
      const nombreRow = document.getElementById("nombreRow" + props.i);
      if (!nombreRow.classList.contains("has-error")) {
        nombreRow.classList.add("has-error");
      }
    }

    if (!cantidadValid) {
      errors = true;
      const cantidadRow = document.getElementById("cantidadRow" + props.i);
      if (!cantidadRow.classList.contains("has-error")) {
        cantidadRow.classList.add("has-error");
      }
    }

    if (!costoCajaValid) {
      errors = true;
      const costoCajaRow = document.getElementById("costoCajaRow" + props.i);
      if (!costoCajaRow.classList.contains("has-error")) {
        costoCajaRow.classList.add("has-error");
      }
    }

    if (!costoUnitValid) {
      errors = true;
      const costoUnitRow = document.getElementById("costoUnitRow" + props.i);
      if (!costoUnitRow.classList.contains("has-error")) {
        costoUnitRow.classList.add("has-error");
      }
    }

    if (!precioUnitValid) {
      errors = true;
      const precioUnitRow = document.getElementById("precioUnitRow" + props.i);
      if (!precioUnitRow.classList.contains("has-error")) {
        precioUnitRow.classList.add("has-error");
      }
    }

    if (!precioCajaValid) {
      errors = true;
      const precioCajaRow = document.getElementById("precioCajaRow" + props.i);
      if (!precioCajaRow.classList.contains("has-error")) {
        precioCajaRow.classList.add("has-error");
      }
    }

    if (!precioPartValid) {
      errors = true;
      const precioPartRow = document.getElementById("precioPartRow" + props.i);
      if (!precioPartRow.classList.contains("has-error")) {
        precioPartRow.classList.add("has-error");
      }
    }

    if (!errors) {
      let newNombre = nombre;
      newNombre =
        newNombre.toLowerCase().charAt(0).toUpperCase() +
        newNombre.toLowerCase().slice(1);
      const newCantidad = parseInt(cantidad);
      const newCostoCaja = parseFloat(costoCaja).toFixed(2);
      const newCostoUnitario = parseFloat(costoUnit).toFixed(2);
      const newPrecioUnitario = parseFloat(precioUnit).toFixed(2);
      const newPrecioCaja = parseFloat(precioCaja).toFixed(2);
      const newPrecioParticular = parseFloat(precioPart).toFixed(2);
      let nameFound = false;

      props.defaultProductsArray.some((product, index) => {
        if (product.nombre === newNombre && props.i !== index) {
          nameFound = true;
          const nombreRow = document.getElementById("nombreRow" + props.i);
          if (!nombreRow.classList.contains("has-error")) {
            nombreRow.classList.add("has-error");
          }
        }
        return nameFound;
      });

      if (nameFound) {
        alert("The name is already in use.");
        setSavingChanges(false);
        setNoSaveWarning(false);
        props.loadingCursorFalse();
      } else {
        const newProduct = {
          nombre: newNombre,
          cantidad: newCantidad,
          costoCaja: newCostoCaja,
          costoUnit: newCostoUnitario,
          precioUnit: newPrecioUnitario,
          precioCaja: newPrecioCaja,
          precioPart: newPrecioParticular,
          id: props.i,
        };
        axios
          .post("/new-product", newProduct)
          .then(function (res) {
            setNombre(newNombre);
            setCantidad(newCantidad);
            setCostoCaja(newCostoCaja);
            setCostoUnit(newCostoUnitario);
            setPrecioUnit(newPrecioUnitario);
            setPrecioCaja(newPrecioCaja);
            setPrecioPart(newPrecioParticular);

            setNombreDefault(newNombre);
            setCantidadDefault(newCantidad);
            setCostoCajaDefault(newCostoCaja);
            setCostoUnitDefault(newCostoUnitario);
            setPrecioUnitDefault(newPrecioUnitario);
            setPrecioCajaDefault(newPrecioCaja);
            setPrecioPartDefault(newPrecioParticular);

            props.updateDefaultNombre(props.i, newNombre);
            props.updateDefaultCantidad(props.i, newCantidad);
            props.updateDefaultCostoCaja(props.i, newCostoCaja);
            props.updateDefaultCostoUnit(props.i, newCostoUnitario);
            props.updateDefaultPrecioUnit(props.i, newPrecioUnitario);
            props.updateDefaultPrecioCaja(props.i, newPrecioCaja);
            props.updateDefaultPrecioPart(props.i, newPrecioParticular);
            const formRow = document.getElementById(props.i);
            formRow.classList.remove("changed");
            setSavingChanges(false);
            setNoSaveWarning(false);
            props.loadingCursorFalse();
          })
          .catch(function (err) {
            props.loadingCursorFalse();
            alert("There has been an error.");
            setSavingChanges(false);
            setNoSaveWarning(false);
          });
        // Aca se mandan los datos al back
        //
        //
      }
    } else {
      props.loadingCursorFalse();
      alert("There are incorrect values.");
      setSavingChanges(false);
      setNoSaveWarning(false);
    }
  }

  return (
    <form
      action="post"
      className={props.i % 2 !== 0 ? "tr uneven" : "tr"}
      key={props.i}
      id={props.i}
      onSubmit={(e) => e.preventDefault()}
    >
      <span className="td nombre-row" id={"nombreRow" + props.i}>
        <div className="delete-row" onClick={() => setDeleteWarning(true)}>
          <i className="fas fa-trash"></i>
        </div>
        <input
          type="text"
          defaultValue={nombre}
          className="form-input"
          name="nombre"
          value={nombre}
        />
      </span>
      <span className="td" id={"cantidadRow" + props.i}>
        <input
          type="text"
          defaultValue={cantidad}
          className="form-input"
          name="cantidad"
          value={cantidad}
          onChange={(e) => {
            setCantidad(e.target.value);
            props.updateCantidad(props.i, e.target.value);
            const cantidadRow = document.getElementById(
              "cantidadRow" + props.i
            );
            if (cantidadRow.classList.contains("has-error")) {
              cantidadRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseInt(e.target.value) !== parseInt(cantidadDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseInt(e.target.value) === parseInt(cantidadDefault) &&
                  nombre === nombreDefault &&
                  parseFloat(costoCaja) === parseFloat(costoCajaDefault) &&
                  parseFloat(costoUnit) === parseFloat(costoUnitDefault) &&
                  parseFloat(precioUnit) === parseFloat(precioUnitDefault) &&
                  parseFloat(precioCaja) === parseFloat(precioCajaDefault) &&
                  parseFloat(precioPart) === parseFloat(precioPartDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <span className="td" id={"costoCajaRow" + props.i}>
        <input
          type="text"
          defaultValue={costoCaja}
          className="form-input"
          name="costoCaja"
          value={costoCaja}
          onChange={(e) => {
            setCostoCaja(e.target.value);
            props.updateCostoCaja(props.i, e.target.value);
            const costoCajaRow = document.getElementById(
              "costoCajaRow" + props.i
            );
            if (costoCajaRow.classList.contains("has-error")) {
              costoCajaRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseFloat(e.target.value) !== parseFloat(costoCajaDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseFloat(e.target.value) === parseFloat(costoCajaDefault) &&
                  nombre === nombreDefault &&
                  parseInt(cantidad) === parseInt(cantidadDefault) &&
                  parseFloat(costoUnit) === parseFloat(costoUnitDefault) &&
                  parseFloat(precioUnit) === parseFloat(precioUnitDefault) &&
                  parseFloat(precioCaja) === parseFloat(precioCajaDefault) &&
                  parseFloat(precioPart) === parseFloat(precioPartDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <span className="td" id={"costoUnitRow" + props.i}>
        <input
          type="text"
          defaultValue={costoUnit}
          className="form-input"
          name="costoUnit"
          value={costoUnit}
          onChange={(e) => {
            setCostoUnit(e.target.value);
            props.updateCostoUnit(props.i, e.target.value);
            const costoUnitRow = document.getElementById(
              "costoUnitRow" + props.i
            );
            if (costoUnitRow.classList.contains("has-error")) {
              costoUnitRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseFloat(e.target.value) !== parseFloat(costoUnitDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseFloat(e.target.value) === parseFloat(costoUnitDefault) &&
                  nombre === nombreDefault &&
                  parseInt(cantidad) === parseInt(cantidadDefault) &&
                  parseFloat(costoCaja) === parseFloat(costoCajaDefault) &&
                  parseFloat(precioUnit) === parseFloat(precioUnitDefault) &&
                  parseFloat(precioCaja) === parseFloat(precioCajaDefault) &&
                  parseFloat(precioPart) === parseFloat(precioPartDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <span className="td" id={"precioUnitRow" + props.i}>
        <input
          type="text"
          defaultValue={precioUnit}
          className="form-input"
          name="precioUnit"
          value={precioUnit}
          onChange={(e) => {
            setPrecioUnit(e.target.value);
            props.updatePrecioUnit(props.i, e.target.value);
            const precioUnitRow = document.getElementById(
              "precioUnitRow" + props.i
            );
            if (precioUnitRow.classList.contains("has-error")) {
              precioUnitRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseFloat(e.target.value) !== parseFloat(precioUnitDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseFloat(e.target.value) ===
                    parseFloat(precioUnitDefault) &&
                  nombre === nombreDefault &&
                  parseInt(cantidad) === parseInt(cantidadDefault) &&
                  parseFloat(costoUnit) === parseFloat(costoUnitDefault) &&
                  parseFloat(costoCaja) === parseFloat(costoCajaDefault) &&
                  parseFloat(precioCaja) === parseFloat(precioCajaDefault) &&
                  parseFloat(precioPart) === parseFloat(precioPartDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <span className="td" id={"precioCajaRow" + props.i}>
        <input
          type="text"
          defaultValue={precioCaja}
          className="form-input"
          name="precioCaja"
          value={precioCaja}
          onChange={(e) => {
            setPrecioCaja(e.target.value);
            props.updatePrecioCaja(props.i, e.target.value);
            const precioCajaRow = document.getElementById(
              "precioCajaRow" + props.i
            );
            if (precioCajaRow.classList.contains("has-error")) {
              precioCajaRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseFloat(e.target.value) !== parseFloat(precioCajaDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseFloat(e.target.value) ===
                    parseFloat(precioCajaDefault) &&
                  nombre === nombreDefault &&
                  parseInt(cantidad) === parseInt(cantidadDefault) &&
                  parseFloat(costoUnit) === parseFloat(costoUnitDefault) &&
                  parseFloat(precioUnit) === parseFloat(precioUnitDefault) &&
                  parseFloat(costoCaja) === parseFloat(costoCajaDefault) &&
                  parseFloat(precioPart) === parseFloat(precioPartDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <span className="td" id={"precioPartRow" + props.i}>
        <input
          type="text"
          defaultValue={precioPart}
          className="form-input"
          name="precioPart"
          value={precioPart}
          onChange={(e) => {
            setPrecioPart(e.target.value);
            props.updatePrecioPart(props.i, e.target.value);
            const precioPartRow = document.getElementById(
              "precioPartRow" + props.i
            );
            if (precioPartRow.classList.contains("has-error")) {
              precioPartRow.classList.remove("has-error");
            }
            const formRow = document.getElementById(props.i);
            if (parseFloat(e.target.value) !== parseFloat(precioPartDefault)) {
              if (!formRow.classList.contains("changed")) {
                formRow.classList.add("changed");
              }
            } else {
              if (formRow.classList.contains("changed")) {
                if (
                  parseFloat(e.target.value) ===
                    parseFloat(precioPartDefault) &&
                  nombre === nombreDefault &&
                  parseInt(cantidad) === parseInt(cantidadDefault) &&
                  parseFloat(costoUnit) === parseFloat(costoUnitDefault) &&
                  parseFloat(precioUnit) === parseFloat(precioUnitDefault) &&
                  parseFloat(precioCaja) === parseFloat(precioCajaDefault) &&
                  parseFloat(costoCaja) === parseFloat(costoCajaDefault)
                ) {
                  formRow.classList.remove("changed");
                }
              }
            }
          }}
        />
      </span>
      <div className="action-btns">
        <button
          className="action-btn"
          onClick={(e) => {
            e.preventDefault();
            const formRow = document.getElementById(props.i);
            if (formRow.classList.contains("changed")) {
              setNoSaveWarning(true);
            } else {
              setSellActive(true);
            }
          }}
        >
          <i class="fas fa-dollar-sign"></i>
        </button>
        <button
          className="action-btn action-btn-blue"
          type="submit"
          disabled={savingChanges}
          onClick={(e) => {
            setNoSaveWarning(true);
            handleSave(e);
          }}
        >
          <i class="fas fa-save"></i>
        </button>
      </div>

      <animated.div
        className="poppup poppup-sell"
        style={deleteWarningAnimation}
      >
        <div
          className="dark-bg dark-bg-alt"
          onClick={() => setDeleteWarning(false)}
        ></div>
        <div className="poppup-add-product  poppup-warning">
          <div className="poppup-close" onClick={() => setDeleteWarning(false)}>
            <i class="fas fa-times"></i>
          </div>
          <div className="highlight-text highlight-text-alt">Delete</div>
          <div className="poppup-form-box">
            <div className="text-small text-alt">
              Sure you want to remove this product?
            </div>
          </div>
          <div className="poppup-form-box">
            <button
              type="submit"
              className="btn btn-main btn-poppup u-margin-bottom-big"
              onClick={(e) => {
                handleDelete();
              }}
            >
              {loadingDelete ? (
                <div className="loading-container">
                  Deleting Product{" "}
                  <i class="fas fa-spinner spinner spinner-btn"></i>
                </div>
              ) : (
                "Delete Product"
              )}
            </button>
          </div>
        </div>
      </animated.div>
      <animated.div
        className="poppup poppup-sell"
        style={noSaveWarningAnimation}
      >
        <div
          className="dark-bg dark-bg-alt"
          onClick={() => setNoSaveWarning(false)}
        ></div>
        <div className="poppup-add-product  poppup-warning">
          <div className="poppup-close" onClick={() => setNoSaveWarning(false)}>
            <i class="fas fa-times"></i>
          </div>
          <div className="highlight-text highlight-text-alt">Save</div>
          <div className="poppup-form-box">
            <div className="text-small text-alt">
              There are unsaved changes in the column.
            </div>
            <div className="text-small text-alt">Save them?</div>
          </div>
          <div className="poppup-form-box">
            <button
              type="submit"
              className="btn btn-main btn-poppup u-margin-bottom-big"
              onClick={(e) => {
                handleSave(e);
              }}
            >
              {savingChanges ? (
                <div className="loading-container">
                  Saving Changes{" "}
                  <i class="fas fa-spinner spinner spinner-btn"></i>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </animated.div>

      <animated.div className="poppup poppup-sell" style={productAnimation}>
        <div className="form">
          <div
            className="dark-bg dark-bg-alt"
            onClick={() => setSellActive(false)}
          ></div>
          <div className="poppup-add-product">
            <div className="poppup-close" onClick={() => setSellActive(false)}>
              <i class="fas fa-times"></i>
            </div>
            <div className="highlight-text highlight-text-alt">Sale</div>
            <Formik
              initialValues={{ cantidadVendida: "", tipoVenta: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                const cantidadVendida = parseInt(values.cantidadVendida);
                const tipoVenta =
                  values.tipoVenta !== "" ? values.tipoVenta : "Unidad";
                if (cantidadVendida > parseInt(cantidad)) {
                  setQtyErr(true);
                  const cantidadInput = document.getElementById(
                    "cantidadVendida"
                  );
                  cantidadInput.focus();
                  cantidadInput.blur();
                  setSubmitting(false);
                } else if (cantidadVendida === parseInt(cantidad)) {
                  let totalVenta = 0;
                  if (tipoVenta === "Caja") {
                    totalVenta = precioCaja * cantidadVendida;
                  } else if (tipoVenta === "Unidad") {
                    totalVenta = precioUnit * cantidadVendida;
                  } else {
                    totalVenta = precioPart * cantidadVendida;
                  }

                  const valuesToSubmit = {
                    nombre: nombre,
                    cantidadVendida: cantidadVendida,
                    tipoVenta: tipoVenta,
                    costoUnit: costoUnitDefault,
                    total: totalVenta,
                  };
                  axios
                    .post("/product-sell", valuesToSubmit)
                    .then(function (res) {
                      props.removeFromArray(props.i);
                      setSubmitting(false);
                      resetForm();
                      setSellActive(false);
                    })
                    .catch(function (err) {
                      alert("There has been an error.");
                      setSubmitting(false);
                      resetForm();
                      setSellActive(false);
                    });
                  // Aca vamos al back end.
                  //
                  //
                } else {
                  setCantidad(cantidad - cantidadVendida);
                  setCantidadDefault(cantidad - cantidadVendida);
                  props.updateDefaultCantidad(
                    props.i,
                    cantidad - cantidadVendida
                  );
                  let totalVenta = 0;
                  if (tipoVenta === "Caja") {
                    totalVenta = precioCaja * cantidadVendida;
                  } else if (tipoVenta === "Unidad") {
                    totalVenta = precioUnit * cantidadVendida;
                  } else {
                    totalVenta = precioPart * cantidadVendida;
                  }

                  const valuesToSubmit = {
                    nombre: nombre,
                    cantidadVendida: cantidadVendida,
                    tipoVenta: tipoVenta,
                    costoUnit: costoUnitDefault,
                    total: totalVenta,
                  };
                  axios
                    .post("/product-sell", valuesToSubmit)
                    .then(function (res) {
                      setSubmitting(false);
                      resetForm();
                      setSellActive(false);
                    })
                    .catch(function (err) {
                      alert("There has been an error.");
                      setSubmitting(false);
                      resetForm();
                      setSellActive(false);
                    });
                  // Aca vamos al back end.
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
                <form action="update" onSubmit={handleSubmit}>
                  <div className="poppup-form-box form-box-alt">
                    <div className="text-small text-alt">
                      Enter the sold quantity
                    </div>
                    <input
                      autoComplete="off"
                      type="text"
                      name="cantidadVendida"
                      id="cantidadVendida"
                      placeholder="Cantidad Vendida"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cantidadVendida}
                      className={
                        touched.cantidadVendida && errors.cantidadVendida
                          ? "poppup-input input-alt has-error"
                          : touched.cantidadVendida && !errors.cantidadVendida
                          ? "poppup-input input-alt hasnt-error"
                          : "poppup-input input-alt"
                      }
                      onClick={() => setQtyErr(false)}
                    />
                  </div>
                  <Error
                    touched={touched.cantidadVendida}
                    message={errors.cantidadVendida}
                  />
                  <div className="poppup-form-box form-box-alt">
                    <div className="text-small text-alt">
                      Enter the sale type
                    </div>
                    <select
                      name="tipoVenta"
                      id="tipoVenta"
                      className={
                        touched.tipoVenta && errors.tipoVenta
                          ? "poppup-input input-alt dropdown has-error"
                          : touched.tipoVenta && !errors.tipoVenta
                          ? "poppup-input input-alt dropdown hasnt-error"
                          : "poppup-input input-alt dropdown"
                      }
                      value={values.tipoVenta}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {" "}
                      <option value="Unidad" selected>
                        Per unit
                      </option>
                      <option value="Caja">Per Stack</option>
                      <option value="Particular">Per Particular</option>
                    </select>

                    <i class="fas fa-caret-down icon-caret"></i>
                  </div>
                  <Error
                    touched={touched.tipoVenta}
                    message={errors.tipoVenta}
                  />
                  <div className="poppup-form-box">
                    <button
                      type="submit"
                      className="btn btn-main btn-poppup u-margin-bottom-big"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="loading-container">
                          Processing Sale{" "}
                          <i class="fas fa-spinner spinner spinner-btn"></i>
                        </div>
                      ) : (
                        "Confirm Sale"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </animated.div>
    </form>
  );
}

export default ProductRow;
