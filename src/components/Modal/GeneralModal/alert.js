import { useState } from "react";

import GeneralModal from ".";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import store from "../../../store";

function AlertModal(props) {
  const [show, setShow] = useState(true);
  const { content, onConfirm = () => {}, ...rest } = props;

  return (
    <GeneralModal
      buttonSize=""
      onConfirm={() => {
        setShow(false);
        onConfirm?.();
      }}
      showCancel={false}
      {...rest}
      visible={show}
    >
      {content}
    </GeneralModal>
  );
}

const alert = (config) => {
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
      <AlertModal {...rest} onDestroy={destroyHandle} />
    </Provider>,

    container
  );
};

export default alert;
