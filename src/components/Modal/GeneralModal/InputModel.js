import Input from "@components/Input";
import React, { useEffect, useState } from "react";
import GeneralModal from ".";

export default function InputModel(props) {
  const [value, setValue] = useState(props.value ?? "");
  const {
    children,
    footer,
    showInput,
    placeholder,
    clear,
    onConfirm,
    ...rest
  } = props;

  function changeHandle({ target: { value } }) {
    setValue(value);
  }

  function renderFooter() {
    if (typeof footer === "function") {
      return (onCancel, onConfirm) => footer(onCancel, onConfirm, value);
    }
    return footer;
  }
  useEffect(() => {
    if (clear) {
      setValue("");
    }
  }, [clear]);
  return (
    <GeneralModal
      {...rest}
      footer={renderFooter()}
      onConfirm={() => onConfirm(value)}
    >
      {children}
      {showInput && (
        <Input onInput={changeHandle} placeholder={placeholder} value={value} />
      )}
    </GeneralModal>
  );
}
