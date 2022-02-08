import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import PC from "./PC";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "mobx-react";
import store from "./store";
// const isMobile = navigator.userAgent.match(
//   /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
// );

// if (!isMobile) {
  
//   ReactDOM.render(
//     <React.StrictMode>
//       <PC />
//     </React.StrictMode>,
//     document.getElementById("root")
//   );
// } else {
  ReactDOM.render(
    <React.StrictMode>
      <Provider {...store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
// }



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
