import './assets/css/asset-sm.css';
import './assets/css/asset.css';
import './assets/css/index.css';
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { Connect } from './page/connect';
import { Profile } from './page/profile';
import {Sign_in} from './page/sign-in';
import {Sign_up} from './page/sign-up';
import {Complete_profile} from './page/complete-profile';
import { Appointment } from './page/appointment';
import { Chat } from './page/chat';
import {App} from "./App";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Profile />
  </StrictMode>,
)
