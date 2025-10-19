import './assets/css/asset-sm.css';
import './assets/css/asset.css';
import './assets/css/index.css';
import {Complete_profile} from './page/complete-profile';
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Complete_profile />
  </StrictMode>,
)
