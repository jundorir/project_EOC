import classNames from "classnames";
import React from "react";
import css from "./index.module.less";
import useClose from "./useClose";

export default function Dialog(props) {
  const [shouldRender, closing] = useClose(props.visible, 200, props.onDestroy);

  if (!shouldRender) {
    return null;
  }

  const { bodyClass, maskClass, children, onMaskClose } = props;

  return (
    <div className={css.container}>
      <div
        onClick={onMaskClose}
        className={classNames(css.mask, maskClass, {
          [css.mask_closing]: closing,
        })}
      ></div>
      <div
        className={classNames(css.body, bodyClass, {
          [css.body_closing]: closing,
        })}
      >
        {children}
      </div>
    </div>
  );
}
