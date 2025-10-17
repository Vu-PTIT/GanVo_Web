import './assets/css/asset-sm.css';
import './assets/css/asset.css';
import './assets/css/index.css';
import {Sign_in} from './page/sign-in';
import {Appointment} from './page/appointment';
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Appointment />
  </StrictMode>,
)
