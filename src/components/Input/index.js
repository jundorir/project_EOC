import React from "react";
import css from "./index.module.less";

export default function Input(props) {
  const { type = "text", ...rest } = props;
  return <input className={css.input} type={type} {...rest} />;
}
