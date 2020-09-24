require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const app = express();
const firebase = require("firebase/app");
require("firebase/firestore");
const path = require("path");

var firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(firebaseApp);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/products", (req, res) => {
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        let products = doc.data().products;
        res.send(products);
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.get("/sales", (req, res) => {
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        let sales = doc.data().sales;
        res.send(sales);
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.post("/products-delete", function (req, res) {
  const id = req.body.id;
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        products = doc.data().products;
        let newProductsArray = [];
        products.forEach((product, index) => {
          if (index !== id) {
            const commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              costoCaja: product.costoCaja,
              costoUnit: product.costoUnit,
              precioUnit: product.precioUnit,
              precioCaja: product.precioCaja,
              precioPart: product.precioPart,
            };
            newProductsArray.push(commonProduct);
          }
        });

        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              products: newProductsArray,
            },
            { merge: true }
          )
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            res.sendStatus(400);
          });
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.post("/products", function (req, res) {
  const newProduct = req.body;
  const total = req.body.cantidad * req.body.costoUnit;

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  const newPurchase = {
    nombre: req.body.nombre,
    fecha: today,
    cantidad: req.body.cantidad,
    costoUnit: req.body.costoUnit,
    total: total,
  };
  const nombre = req.body.nombre;
  const cantidad = req.body.cantidad;

  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(async function (doc) {
      if (doc.exists) {
        let restockArray = doc.data().restock;
        let purchases = doc.data().purchases;
        let products = doc.data().products;
        let newArrayRestock = [];
        // Buscar el producto en restock para eliminarlo o bajarle la cantidad
        await restockArray.forEach((product) => {
          if (product.nombre === nombre) {
            if (product.cantidad > cantidad) {
              let newCantidad = product.cantidad - cantidad;
              let updatedProduct = {
                nombre: product.nombre,
                cantidad: newCantidad,
                costoUnit: product.costoUnit,
                total: product.costoUnit * newCantidad,
              };
              newArrayRestock.push(updatedProduct);
            } // Si la cantidad es menor o igual no se agrega en el array, entonces se borra.
          } else {
            let commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              costoUnit: product.costoUnit,
              total: product.total,
            };
            newArrayRestock.push(commonProduct);
          }
        });

        //Actualizando los arrays
        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              restock: newArrayRestock,
              purchases: [...purchases, newPurchase],
              products: [...products, newProduct],
            },
            { merge: true }
          )
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (error) {
            res.sendStatus(400);
          });
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.post("/product-sell", function (req, res) {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");

  today = dd + "/" + mm + "/" + yyyy;

  docRef.get().then(async function (doc) {
    const nombre = req.body.nombre;
    const cantidadVendida = req.body.cantidadVendida;
    const tipoVenta = req.body.tipoVenta;
    const total = req.body.total;
    const costoUnit = req.body.costoUnit;
    let foundName = false;
    if (doc.exists) {
      let restockArray = doc.data().restock;
      let salesArray = doc.data().sales;
      let productsArray = doc.data().products;
      let id = doc.data().id + 1;
      let newArrayRestock = [];

      const newSale = {
        id: id,
        nombre: nombre,
        fecha: today,
        cantidad: cantidadVendida,
        tipoVenta: tipoVenta,
        total: total,
      };
      // Buscar el producto en restock para eliminarlo o sumarle la cantidad
      await restockArray.forEach((product) => {
        if (product.nombre === nombre) {
          foundName = true;
          let newCantidad = product.cantidad + cantidadVendida;
          let updatedProduct = {
            nombre: product.nombre,
            cantidad: newCantidad,
            costoUnit: product.costoUnit,
            total: product.costoUnit * newCantidad,
          };
          newArrayRestock.push(updatedProduct);
        } else {
          let commonProduct = {
            nombre: product.nombre,
            cantidad: product.cantidad,
            costoUnit: product.costoUnit,
            total: product.total,
          };
          newArrayRestock.push(commonProduct);
        }
      });

      if (!foundName) {
        let newProduct = {
          nombre: nombre,
          cantidad: cantidadVendida,
          costoUnit: costoUnit,
          total: costoUnit * cantidadVendida,
        };
        newArrayRestock.push(newProduct);
      }

      let newArrayProducts = [];
      // Buscar el producto en restock para eliminarlo o bajarle la cantidad
      productsArray.forEach((product) => {
        if (product.nombre === nombre) {
          if (product.cantidad > cantidadVendida) {
            let newCantidad = product.cantidad - cantidadVendida;
            let updatedProduct = {
              nombre: product.nombre,
              cantidad: newCantidad,
              costoCaja: product.costoCaja,
              costoUnit: product.costoUnit,
              precioUnit: product.precioUnit,
              precioCaja: product.precioCaja,
              precioPart: product.precioPart,
            };
            newArrayProducts.push(updatedProduct);
          } // Si la cantidad es menor o igual no se agrega en el array, entonces se borra.
        } else {
          let commonProduct = {
            nombre: product.nombre,
            cantidad: product.cantidad,
            costoCaja: product.costoCaja,
            costoUnit: product.costoUnit,
            precioUnit: product.precioUnit,
            precioCaja: product.precioCaja,
            precioPart: product.precioPart,
          };
          newArrayProducts.push(commonProduct);
        }
      });

      db.collection("stockr")
        .doc("rwlMNmags4dMki4iWsB7")
        .set(
          {
            restock: newArrayRestock,
            products: newArrayProducts,
            sales: [...salesArray, newSale],
            id: id,
          },
          { merge: true }
        )
        .then(function () {
          res.sendStatus(200);
        })
        .catch(function (err) {
          res.sendStatus(400);
        });
    }
  });
});

app.post("/new-product", function (req, res) {
  const nombre = req.body.nombre;
  const cantidad = req.body.cantidad;
  const costoCaja = req.body.costoCaja;
  const costoUnit = req.body.costoUnit;
  const precioUnit = req.body.precioUnit;
  const precioCaja = req.body.precioCaja;
  const precioPart = req.body.precioPart;

  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");

  let newArrayRestock = [];
  let newArrayProducts = [];
  let cantidadVieja = 0;

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;

  docRef.get().then(async function (doc) {
    if (doc.exists) {
      let productsArray = doc.data().products;
      let purchasesArray = doc.data().purchases;
      let restockArray = doc.data().restock;

      await productsArray.forEach((product) => {
        if (product.nombre === nombre) {
          cantidadVieja = product.cantidad;
          let updatedProduct = {
            nombre: nombre,
            cantidad: cantidad,
            costoCaja: costoCaja,
            costoUnit: costoUnit,
            precioUnit: precioUnit,
            precioCaja: precioCaja,
            precioPart: precioPart,
          };
          newArrayProducts.push(updatedProduct);
        } else {
          let commonProduct = {
            nombre: product.nombre,
            cantidad: product.cantidad,
            costoCaja: product.costoCaja,
            costoUnit: product.costoUnit,
            precioUnit: product.precioUnit,
            precioCaja: product.precioCaja,
            precioPart: product.precioPart,
          };
          newArrayProducts.push(commonProduct);
        }
      });
      // Se actualiza el array de restock
      if (cantidadVieja > cantidad) {
        let foundName = false;
        await restockArray.forEach((product) => {
          if (product.nombre === nombre) {
            foundName = true;
            let updatedProduct = {
              nombre: nombre,
              cantidad: product.cantidad + (cantidadVieja - cantidad),
              costoUnit: costoUnit,
              total:
                costoUnit * (product.cantidad + (cantidadVieja - cantidad)),
            };
            newArrayRestock.push(updatedProduct);
          } else {
            let commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              costoUnit: product.costoUnit,
              total: product.total,
            };
            newArrayRestock.push(commonProduct);
          }
        });

        if (!foundName) {
          let newProduct = {
            nombre: nombre,
            cantidad: cantidadVieja - cantidad,
            costoUnit: costoUnit,
            total: costoUnit * (cantidadVieja - cantidad),
          };
          newArrayRestock.push(newProduct);
        }

        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              restock: newArrayRestock,
            },
            { merge: true }
          )
          .catch(function (err) {
            res.sendStatus(400);
          });
      } else if (cantidadVieja < cantidad) {
        //Se agrega un registro de compra
        const newPurchase = {
          nombre: nombre,
          fecha: today,
          cantidad: cantidad - cantidadVieja,
          costoUnit: costoUnit,
          total: costoUnit * (cantidad - cantidadVieja),
        };
        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              purchases: [...purchasesArray, newPurchase],
            },
            { merge: true }
          )
          .catch(function (err) {
            res.sendStatus(400);
          });
      }

      db.collection("stockr")
        .doc("rwlMNmags4dMki4iWsB7")
        .set(
          {
            products: newArrayProducts,
          },
          { merge: true }
        )
        .then(function () {
          res.sendStatus(200);
        })
        .catch(function (err) {
          res.sendStatus(400);
        });
    }
  });
  //Hay que actualizar el elemento en la seccion productos que tenga el mismo
  //nombre que mandemos del back. Tambien, si se sumo
  //nueva cantidad al producto, se tiene que agregar una compra.
  //si se resto una cantidad al producto, se agrega al restock.
  //actualizar el costo unitario y el total en restock.
});

app.post("/sales", function (req, res) {
  const id = req.body.id;
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        sales = doc.data().sales;
        let newSalesArray = [];
        sales.forEach((product, index) => {
          if (index !== id) {
            const commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              fecha: product.fecha,
              id: product.id,
              tipoVenta: product.tipoVenta,
              total: product.total,
            };
            newSalesArray.push(commonProduct);
          }
        });

        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              sales: newSalesArray,
            },
            { merge: true }
          )
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            res.sendStatus(400);
          });
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.get("/purchases", function (req, res) {
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        let purchases = doc.data().purchases;
        res.send(purchases);
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.post("/purchases", function (req, res) {
  const id = req.body.id;
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        purchases = doc.data().purchases;
        let newPurchasesArray = [];
        purchases.forEach((product, index) => {
          if (index !== id) {
            const commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              fecha: product.fecha,
              costoUnit: product.costoUnit,
              total: product.total,
            };
            newPurchasesArray.push(commonProduct);
          }
        });

        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              purchases: newPurchasesArray,
            },
            { merge: true }
          )
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            res.sendStatus(400);
          });
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.get("/restock-data", function (req, res) {
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        let restock = doc.data().restock;
        res.send(restock);
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.post("/restock", function (req, res) {
  const id = req.body.id;
  const docRef = db.collection("stockr").doc("rwlMNmags4dMki4iWsB7");
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        restock = doc.data().restock;
        let newRestockArray = [];
        restock.forEach((product, index) => {
          if (index !== id) {
            const commonProduct = {
              nombre: product.nombre,
              cantidad: product.cantidad,
              costoUnit: product.costoUnit,
              total: product.total,
            };
            newRestockArray.push(commonProduct);
          }
        });

        db.collection("stockr")
          .doc("rwlMNmags4dMki4iWsB7")
          .set(
            {
              restock: newRestockArray,
            },
            { merge: true }
          )
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            res.sendStatus(400);
          });
      }
    })
    .catch(function (err) {
      res.sendStatus(400);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
