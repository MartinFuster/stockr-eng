import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Purchases from "./components/Purchases";
import Restock from "./components/Restock";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Products} />
          <Route path="/ventas" component={Sales} />
          <Route path="/compras" component={Purchases} />
          <Route path="/restock" component={Restock} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
