// 战役
import React, {Fragment, useEffect, useState} from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import {RewardIcon} from "../List"
import useMaterial from "@common/const/define/Material";
import {inject, observer} from "mobx-react";
function Modal(props) {
  const {visible, setVisible, levelData, title = '胜利', btnText='完成', languageStore} = props
  const Material = useMaterial(languageStore.language);
  if(!visible) {
    return null
  }
  return (
    <div className={css.modal}>
        <div className={css.modalMain}>
          <div className={css.modalMainBig}>
          </div>
          <div className={css.modalMainContent}>
            <p className={css.modalTit1}>{languageStore.language.battle_victory}</p>
            <p className={css.modalTit2}>{languageStore.language.battle_Reward_please}</p>
            <ul>
              {levelData.exp ?
                <li>
                  <img src={Material['ExperienceBookPrimary']?.images} />
                  <label>{Material['ExperienceBookPrimary']?.title} X{levelData.exp}</label>
                </li>
                : null}
              {levelData.gold ?
                <li>
                  <img src={Material['Gold']?.images} />
                  <label>{Material['Gold']?.title} X{levelData.gold}</label>
                </li>
                : null}
            </ul>
          </div>
          <div className={css.modalFooter}>
            <Button onClick={()=>{ setVisible(false)}}>{languageStore.language.battle_complete}</Button>
          </div>
        </div>

    </div>
  );
}
export default inject("view", "languageStore")(observer(Modal));
