/**
 * 
 *
 */
import css from "./index.module.less";
import BaseModal from "../BaseModal";
import { Fragment } from "react/cjs/react.production.min";
import Button from "@components/Button";

function ConfirmModal(props) {
  function handle(item) {
    if (item === "cancel") {
      props.closeModal();
    } else if (item === "confim") {
      // console.log("确定");
    }
  }
  return (
    <Fragment>
      <div className={css.cloak}></div>
      <div className={css.contain}>
        <div className={css.title}>{props.title}</div>
        {props.isShow && <div className={css.modal_up}></div>}
        <div className={css.content}>{props.content}</div>
        {props.isShow && <div className={css.modal_down}></div>}
        {props.isShowButton && (
          <div className={css.button}>
            <Button onClick={props.onConfirm} size="middle">
              {props.confirmText}
            </Button>
            <Button onClick={props.onInpower} size="middle">
              {props.impower}
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default BaseModal(ConfirmModal);
