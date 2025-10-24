import './assets/css/asset-sm.css';
import './assets/css/asset.css';
import './assets/css/index.css';
import {Appointment} from './page/appointment';
import {Header} from './assets/components/header';
import {Footer} from './assets/components/footer';
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Appointment />
    <Footer />
  </StrictMode>,
)
