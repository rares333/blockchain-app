import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ethers } from "ethers";
window.ethers = ethers;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
