import React from "react";
import rDOM from "react-dom/client";
import './assets/css/main.css'
import RouterConfig from "./config/router.config.tsx";
import { Provider } from "react-redux";
import store from './config/store.config'
const root = rDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterConfig />
    </Provider>
  </React.StrictMode>
)