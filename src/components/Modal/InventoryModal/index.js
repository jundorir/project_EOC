/**
 * 确认弹窗
 * 双按钮
 */
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import BaseModal from "../HeroModal/BaseHeroModal";
import Button from "@components/Button";
function InventoryModal(props) {
  const {
    canUse = true,
    disabled = false,
    languageStore: { language },
  } = props;

  return (
    <div className={css.messageModal}>
      <div className={css.contain}>
        <div className={css.box}>{props.children}</div>
        <div className={css.buttons}>
          <Button onClick={props.onGive} className={css.btn}>
            {language.give}
          </Button>
          <Button
            onClick={() => {
              (props.onSubmit ?? props.closeModal)?.();
            }}
            className={css.btn}
            disabled={disabled}
          >
            {canUse ? language.use : language.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(BaseModal(InventoryModal)));
