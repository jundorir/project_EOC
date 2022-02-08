/**
 * 确认弹窗
 * 双按钮
 */
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import Button from "@components/Button";
import GeneralModal from "@components/Modal/GeneralModal";
function GiveModal(props) {
  const {
    visible,
    disabled,
    onConfirm,
    languageStore: { language },
  } = props;

  return (
    <GeneralModal
      visible={visible === "give"}
      buttonSize={""}
      title={<div className={css.giveTitle}>{language.Give_props}</div>}
      showTexture={false}
      footer
      footerContent={
        <div className={css.giveButtons}>
          <Button className={css.btn} onClick={props.closeModal}>
            {language.battle_cancel}
          </Button>
          <Button onClick={onConfirm} className={css.btn} disabled={disabled}>
            {language.OK}
          </Button>
        </div>
      }
    >
      <div className={css.giveModal}>{props.children}</div>
    </GeneralModal>
  );
}

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(GiveModal));
