/**
 * 确认弹窗
 * 双按钮
 */
import css from "./index.module.less";
import BaseModal from "../BaseHeroModal";
import Button from "@components/Button";
import { inject, observer } from "mobx-react";

function MessageModal(props) {
  const {
    languageStore: { language },
    btnTitle = language.confirm,
    disabled = false,
  } = props;
  return (
    <div className={css.messageModal}>
      <div className={css.contain}>
        <div className={css.title}>{props.title}</div>
        <div className={css.box}>
          <div className={css.modal_up}></div>
          {props.children}
          <div className={css.modal_down}></div>
        </div>
        <div className={css.buttons}>
          <Button
            disabled={disabled}
            onClick={() => {
              (props.onSubmit ?? props.closeModal)?.();
            }}
            className={css.btn}
          >
            {btnTitle}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(BaseModal(MessageModal)));
