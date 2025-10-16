import './assets/css/asset-sm.css';
import './assets/css/asset.css';
import './assets/css/index.css';
import {Sign_in} from './sign-in';
import {Header} from './assets/element/header';
import {Appointment} from './appointment';
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Appointment />
  </StrictMode>,
)
