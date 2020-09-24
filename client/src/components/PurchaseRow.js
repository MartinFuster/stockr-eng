import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";

function PurchaseRow(props) {
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deleteWarningAnimation = useSpring({
    opacity: deleteWarning ? 1 : 0,
    visibility: deleteWarning ? "visible" : "hidden",
  });

  function handleDelete() {
    setLoadingDelete(true);
    const data = {
      nombre: props.object.nombre,
      id: props.i,
    };
    axios
      .post("/purchases", data)
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
  return (
    <div
      className={props.i % 2 !== 0 ? "tr uneven" : "tr"}
      key={props.i}
      id={props.i}
    >
      <span className="td cell-style">{props.object.nombre}</span>
      <span className="td cell-style">{props.object.fecha}</span>
      <span className="td cell-style">{props.object.cantidad}</span>
      <span className="td cell-style">{props.object.costoUnit}</span>
      <span className="td cell-style">{props.object.total}</span>
      <div className="action-btns">
        <button
          className="action-btn action-btn-red"
          onClick={() => setDeleteWarning(true)}
        >
          <i class="fas fa-trash"></i>
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
        <div className="poppup-add-product non-scroll  poppup-warning">
          <div className="poppup-close" onClick={() => setDeleteWarning(false)}>
            <i class="fas fa-times"></i>
          </div>
          <div className="highlight-text highlight-text-alt">Delete</div>
          <div className="poppup-form-box">
            <div className="text-small text-alt">
              Do you want to remove this register?
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
                  Deleting Register{" "}
                  <i class="fas fa-spinner spinner spinner-btn"></i>
                </div>
              ) : (
                "Delete Register"
              )}
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  );
}

export default PurchaseRow;
