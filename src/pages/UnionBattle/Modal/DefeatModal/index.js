// 战役
import React, { Fragment, useEffect, useState } from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import icon_level from "@assets/images/battle/icon_level.png";
import icon_pub from "@assets/images/battle/icon_pub.png";
import icon_star from "@assets/images/battle/icon_star.png";
import { inject, observer } from "mobx-react";
function Modal(props) {
  const { visible, closeModal, languageStore } = props;
  if (!visible) {
    return null;
  }
  return (
    <div className={css.modal}>
      <div className={css.modalMain}>
        <div className={css.modalMainBig}></div>
        <div className={css.modalMainContent}>
          <p className={css.modalTit1}>
            {languageStore.language.battle_defeat}
          </p>
          <p className={css.modalTit2}>
            战斗失败，可召集更多成员报名参战以提升战力!
          </p>
          {/* <ul>
                <li>
                  <img src={icon_pub} />
                  <div>
                    <label>{languageStore.language.Tavern}</label>
                    <span>{languageStore.language.battle_defeat_hint2}</span>
                  </div>
                </li>
                <li>
                  <img src={icon_level} />
                  <div>
                    <label>{languageStore.language.hero_Hero_upgrade}</label>
                    <span>{languageStore.language.battle_defeat_hint3}</span>
                  </div>
                </li>
                <li>
                  <img src={icon_star} />
                  <div>
                    <label>{languageStore.language.hero_Hero_rising_star}</label>
                    <span>{languageStore.language.battle_defeat_hint4}</span>
                  </div>
                </li>
            </ul> */}
        </div>
        <div className={css.modalFooter}>
          <Button
            onClick={() => {
              closeModal();
            }}
          >
            {languageStore.language.battle_complete}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default inject("languageStore")(observer(Modal));
