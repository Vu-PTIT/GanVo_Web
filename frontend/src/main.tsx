import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



// Code mới
// import './assets/css/asset-sm.css';
// import './assets/css/asset.css';
// import './assets/css/index.css';
// import ReactDOM from "react-dom/client";
// import { StrictMode } from "react";
// import {App} from "./App";

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App  />
//   </StrictMode>,
// )
