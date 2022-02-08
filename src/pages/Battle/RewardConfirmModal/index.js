// 战役
import {Fragment, useEffect, useState} from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import {RewardIcon} from "../List"
import PrizeOpenModal from "@components/Modal/PrizeOpenModal";
import {inject, observer} from "mobx-react";
import useMaterial from "@common/const/define/Material";
function Modal(props) {
  const {visible, setVisible, heroPower, view, rewardData, getExpAndGold, languageStore} = props
  const Material = useMaterial(languageStore.language);
  if(visible === 0){
    return  null
  }
  function onConfirm() {
    if(visible === 1){
      getExpAndGold()
    }else {
      setVisible()
    }
  }
  let title = visible === 1 ?  languageStore.language.battle_Reward_received : <span style={{color: '#FFF04A', fontWeight:'bold', fontFamily: 'STKaitiSC-Regular'}}>{
    languageStore.language.receiveSuccess
  }</span>;
  let confirmText = visible === 1 ? languageStore.language.battle_receive:  languageStore.language.battle_complete;
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
      <PrizeOpenModal
        visible={true}
        showTexture={true}
        title={title}
        showSun={visible === 2}
        onConfirm={()=>{ onConfirm()}}
        onCancel={()=>{ setVisible()}}
        confirmText={confirmText}
        showCancel={visible === 1}
        cancelText= {languageStore.language.battle_cancel}
        buttonSize={''}
      >
        <div className={css.content}>
          <div className={css.contentList}>
            {rewardData.exp > 0 ?
              <div className={css.prizeItem}>
                <div className={css.prizeItemHeader}>
                  <img src={Material['ExperienceBookPrimary']?.images} />
                  <div className={css.prizeItemNum}>{rewardData.exp}</div>
                </div>
                <div className={css.prizeItemTitle}>{Material['ExperienceBookPrimary']?.title}</div>
              </div>
              : null}
            {rewardData.gold > 0 ?
              <div className={css.prizeItem}>
                <div className={css.prizeItemHeader}>
                  <img src={Material['Gold']?.images} />
                  <div className={css.prizeItemNum}>{getGold(rewardData.gold)}</div>
                </div>
                <div className={css.prizeItemTitle}>{Material['Gold']?.title}</div>
              </div>
              : null}
            {rewardData.hoe > 0 ?
              <div className={css.prizeItem}>
                <div className={css.prizeItemHeader}>
                  <img src={Material['EmpireHoeToken']?.images} />
                  <div className={css.prizeItemNum}>{rewardData.hoe}</div>
                </div>
                <div className={css.prizeItemTitle}>{Material['EmpireHoeToken']?.title}</div>
              </div>
              : null}
          </div>
          {(visible === 1 && rewardData.isRepeat === 1) ?<div className={css.repeatTis}>{languageStore.language.battle_receive_old_text}</div> : null}
        </div>
      </PrizeOpenModal>
    </Fragment>
  );
}
export default inject("view", "languageStore")(observer(Modal));
