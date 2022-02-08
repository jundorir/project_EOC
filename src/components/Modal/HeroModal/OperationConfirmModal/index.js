/**
 * 确认弹窗
 * 双按钮
 */
import css from "./index.module.less";
import BaseModal from "../BaseHeroModal";
import Button from "@components/Button";
import { inject, observer } from "mobx-react";

function OperationConfirmModal(props) {
  const {
    languageStore: { language },
    cancelText = language.ancel,
    submitText = language.confirm,
    onCancel,
    onSubmit,
    confirmDisabled,
  } = props;
  function handle(item) {
    if (item === "cancel") {
      if (onCancel) {
        onCancel();
      } else {
        props.closeModal();
      }
    } else if (item === "confim") {
      onSubmit();
    }
  }
  return (
    <div className={css.confirmModal}>
      <div className={css.contain}>
        <div className={css.title}>{props.title}</div>
        <div className={css.box}>
          <div className={css.modal_up}></div>
          {props.children}
          <div className={css.modal_down}></div>
        </div>
        <div className={css.buttons}>
          <Button
            onClick={() => {
              handle("cancel");
            }}
            className={css.btn}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              handle("confim");
            }}
            className={css.btn}
            disabled={confirmDisabled}
          >
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default inject("languageStore")(
  observer(BaseModal(OperationConfirmModal))
);
