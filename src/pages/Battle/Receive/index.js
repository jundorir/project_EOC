// 战役
import React, {Fragment, useEffect, useState} from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import {RewardIcon} from "../List"
import useMaterial from "@common/const/define/Material";
import {inject, observer} from "mobx-react";
function Modal(props) {
  const {userStore, languageStore, receiveAwardExpAndGold} = props
  const { receive_gold, receive_exp, receive_hoe } = userStore;
  const Material = useMaterial(languageStore.language);
  function getGold(gold) {
    if(gold < 1000){
      return gold
    }else {
      let str = (gold / 1000).toString();
      let [s1, s2 = ''] = str.split('.');
      return Number(s1 + '.' + s2.slice(0,2)) + 'K'
    }
  }
  return (
    <Fragment>
      <div className={css.receiveFooter} />
      <div className={css.receive}>
        <div className={css.receivePrize}>
          <div className={css.prizeItem}>
            <div className={css.prizeItemHeader}>
              <img src={Material['ExperienceBookPrimary']?.images} />
              <div className={css.prizeItemNum}>{receive_exp}</div>
            </div>
            {receive_hoe === 0 ?<div className={css.prizeItemTitle}>{Material['ExperienceBookPrimary']?.title}</div> : null}
          </div>
          <div className={css.prizeItem}>
            <div className={css.prizeItemHeader}>
              <img src={Material['Gold']?.images} />
              <div className={css.prizeItemNum}>{getGold(receive_gold)}</div>
            </div>
            {receive_hoe === 0 ? <div className={css.prizeItemTitle}>{Material['Gold']?.title}</div> : null}
          </div>
          {receive_hoe > 0 ?
          <div className={css.prizeItem}>
            <div className={css.prizeItemHeader}>
              <img src={Material['EmpireHoeToken']?.images} />
              <div className={css.prizeItemNum}>{receive_hoe}</div>
            </div>
            {/*<div className={css.prizeItemTitle}>{Material['EmpireHoeToken']?.title}</div>*/}
          </div>
          : null}
        </div>
        <Button onClick={receiveAwardExpAndGold} disabled={!receive_gold && !receive_exp && !receive_hoe}>{languageStore.language.battle_Receive_rewards}</Button>
      </div>
    </Fragment>
  );
}
export default inject("view", "languageStore", "userStore")(observer(Modal));
