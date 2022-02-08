import { Provider } from "mobx-react";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import store from '../../../store';
import InputModel from "./InputModel";

function ConfirmModal(props) {
  const [show, setShow] = useState(true);

  const {
    content = "",
    onCancel = () => {},
    onConfirm = () => {},
    ...reset
  } = props;

  return (
    <InputModel
      onCancel={() => {
        setShow(false);
        onCancel();
      }}
      onConfirm={(v) => {
        setShow(false);
        onConfirm(v);
      }}
      {...reset}
      visible={show}
    >
      {content}
    </InputModel>
  );
}

const confirm = function (config) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const { onDestroy = () => {}, ...rest } = config;

  function destroyHandle() {
    onDestroy();
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  }

  ReactDOM.render(
    <Provider {...store}>
      <ConfirmModal onDestroy={destroyHandle} {...rest} />,
    </Provider>,
    container
  );
};

export default confirm;
