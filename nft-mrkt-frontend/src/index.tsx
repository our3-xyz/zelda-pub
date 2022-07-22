import "./index.scss";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SplashPage from "./components/SplashPage/SplashPage";
import MakerComponent from "./components/Maker/MakerComponent";
import About from "./components/About/About";
import Browse from "./components/SplashPage/Browse/Browse";
import ItemDetail, { CONTRACT_ADDRESS_PARAM, TOKEN_ID_PARAM } from "./components/ItemDetail/ItemDetail";
import Scan from "./components/Scan/Scan";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
          <Routes>
              <Route path="/health" element={<div>Hey There!!! The App is Healthy</div>} />
              <Route path="/" element={<App />} >
              <Route index element={<SplashPage />} />
              <Route path="maker" element={<MakerComponent />} />
              <Route path="consumer" element={<Browse />} />
              <Route path="/consumer/:userAddress" element={<Browse />} />
              <Route path="about" element={<About />} />
              <Route path="browse" element={<Browse />} />
              <Route path="itemDetail" element={<ItemDetail />} />
              <Route path={`itemDetail/:${CONTRACT_ADDRESS_PARAM}/:${TOKEN_ID_PARAM}`} element={<ItemDetail />} />
              <Route path={`itemDetail/:${CONTRACT_ADDRESS_PARAM}/:${TOKEN_ID_PARAM}/:makerAddress`} element={<ItemDetail />} />
              <Route path="scan" element={<Scan />} />
              <Route path="scan/:makerAddress" element={<Scan />} />
              </Route>
          </Routes>
        </BrowserRouter>
  </React.StrictMode>
);
