import MaterialCard from "@components/Card/MaterialCard";
import { Input } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import OperationConfirmModal from "../OperationConfirmModal";
import css from "./index.module.less";
function MaterialModal(props) {
  const {
    materialKey,
    quantity,
    onSubmit,
    languageStore: { language },
    ...others
  } = props;
  const [input, setInput] = useState(0);
  return (
    <OperationConfirmModal
      {...others}
      onSubmit={() => {
        onSubmit?.(input);
      }}
      onCancel={() => {
        setInput(quantity);
      }}
      cancelText="MAX"
      submitText={language.confirm}
      confirmDisabled={input <= 0}
    >
      <div className={css.content}>
        <MaterialCard materialKey={materialKey} quantity={quantity} />
        <div className={css.stepper}>
          <div
            className={css.minus}
            onClick={() => {
              setInput(input - 1 > 0 ? input - 1 : 0);
            }}
          ></div>
          <Input
            value={input}
            onChange={(value) => {
              if (value === "") {
                value = 0;
              }
              let number = parseInt(value);
              if (number >= 0) {
                number = number > quantity ? quantity : number;
                setInput(number);
              }
            }}
          />
          <div
            className={css.plus}
            onClick={() => {
              setInput(input + 1 < quantity ? input + 1 : quantity);
            }}
          ></div>
        </div>
      </div>
    </OperationConfirmModal>
  );
}

export default inject("languageStore")(observer(MaterialModal));
