import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Head from "../template/Head";
import Home from "../views/Home";
import Workshop from "./Workshop";
import SvgExtrudeComponent from "./SvgExtrudeComponent";

function RoutePages() {
    return (
        <Router>
            <Head/>
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route path="/workshop" element={<Workshop/>} />
                <Route path="/svg-extrude" element={<SvgExtrudeComponent/>} />
            </Routes>
        </Router>
    )
}

export default RoutePages;