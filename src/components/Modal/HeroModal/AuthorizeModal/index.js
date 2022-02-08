import css from "./index.module.less";
import BaseModal from "../BaseHeroModal";
import Button from "@components/Button";
import { inject, observer } from "mobx-react";

function AuthorizeModal(props) {
  const {
    toApprove,
    toSubmit,
    isApprove = false,
    title = "",
    languageStore: { language },
  } = props;
  return (
    <div className={css.authorizeModal}>
      <div className={css.contain}>
        <div className={css.title}>{title}</div>
        <div className={css.box}>
          <div className={css.modal_up}></div>
          {props.children}
          <div className={css.modal_down}></div>
        </div>
        <div className={css.buttons}>
          <Button
            onClick={() => {
              toApprove();
            }}
            className={css.btn}
            disabled={isApprove}
          >
            {language.auth}
          </Button>
          <Button
            onClick={() => {
              toSubmit();
            }}
            className={css.btn}
            disabled={!isApprove}
          >
            {language.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(BaseModal(AuthorizeModal)));
