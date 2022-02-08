import React from "react";
import css from "./index.module.less";

export default function SmallButton(props) {
  const { onClick, children, ...reset } = props;
  return (
    <button className={css.button} onClick={onClick} {...reset}>
      {props.children}
    </button>
  );
}

SmallButton.defaultProps = {
  onClick: () => {},
};
