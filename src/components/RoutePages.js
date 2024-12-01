import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Head from "../template/Head";
import Home from "../views/Home";
import Workshop from "./Workshop";
import ProductList from "../template/ProductList";
import ProductPage from "../template/ProductPage";

function RoutePages() {
    return (
        <Router>
            <Head/>
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route path="/workshop" element={<Workshop/>} />
                <Route path="/products/:productType" element={<ProductList/>} />
                <Route path="/product" element={<ProductPage/>} />
            </Routes>
        </Router>
    )
}

export default RoutePages;