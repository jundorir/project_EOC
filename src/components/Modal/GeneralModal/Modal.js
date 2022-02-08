/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import React from "react";
import css from "./index.module.less";

function GeneralModal(props) {
  const { languageStore: { language } } = props;
  const {
    buttonSize,
    title = language.confirm,
    onConfirm,
    confirmText = language.OK,
    footer,
    showCancel,
    onCancel,
    cancelText = language.ancel,
    maskClosable,
    visible,
    onDestroy,
    showTexture,
    showSun,
    footerContent,
  } = props;

  function renderFooter() {
    if (footer) {
      if (typeof footer === "function") {
        return footer(onCancel, onConfirm);
      }
      return footer;
    }
    return (
      <div className={css.actions}>
        {showCancel && (
          <Button onClick={onCancel} size={buttonSize}>
            {cancelText}
          </Button>
        )}
        <Button onClick={onConfirm} size={buttonSize}>
          {confirmText}
        </Button>
      </div>
    );
  }
  return (
    <Dialog
      visible={visible}
      bodyClass={css.body}
      onDestroy={onDestroy}
      onMaskClose={() => {
        if (maskClosable) {
          onCancel();
        }
      }}
    >
      <div className={css.cloak}>
        {showSun ? <div className={css.contentSun}></div> : null}
      </div>
      <div className={css.content}>
        {title ? <h6 className={css.title}>{title}</h6> : null}
        {showTexture ? <div className={classNames(css.texture, css.texture_up)}></div> : null}
        <div className={css.main}>{props.children}</div>
        {showTexture ? <div className={classNames(css.texture, css.texture_down)}></div> : null}
        {renderFooter()}
      </div>
      {footerContent}
    </Dialog>
  );
}

const nop = () => {};
GeneralModal.defaultProps = {
  showCancel: true,
  showTexture: true,
  onCancel: nop,
  onConfirm: nop,
  onDestroy: nop,
  footer: null,
  footerContent: null,
  visible: false,
  showSun: false,
  buttonSize: "middle", // middle,small
  maskClosable: true,
};


export default inject(
  "languageStore"
)(observer(GeneralModal));
