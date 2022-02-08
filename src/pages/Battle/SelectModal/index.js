// 战役
import {Fragment, useEffect, useRef, useState} from "react";
import Button from "@components/Button";
import classNames from "classnames";
import GeneralModal from "@components/Modal/GeneralModal";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";


function Select(props) {
  const {visible, setVisible, selectVal = 1, handleDifficulty, difficultyMaxVal, languageStore} = props
  const SelectList = [
    {
      title: languageStore.language.battle_simple,
      val: 1,
    },
    {
      title: languageStore.language.battle_ordinary,
      val: 2,
    },
    {
      title: languageStore.language.battle_difficulty,
      val: 3,
    },
    {
      title: languageStore.language.battle_Infernal,
      val: 4,
    },
  ]
  useEffect((item)=>{
    if(selectVal){
      handleDifficulty(SelectList[selectVal - 1] || SelectList[SelectList.length - 1])
    }
  }, [selectVal])

  return (
    <Fragment>
      <GeneralModal showSun={false} showTexture={false} visible={visible} footer={<Fragment />} title={""} onCancel={()=>{ setVisible(false)}} onConfirm={()=>{ setVisible(false)}} showCancel={false} buttonSize={''}>
        <div className={css.selectContent}>
          {SelectList.map((item, index)=> (
            <div className={classNames(css.selectList)} key={index} onClick={()=>{handleDifficulty(item, index)}}>
              <label>{item.title}</label>
              <div className={css.selectListCheckbox}>
                {selectVal === item.val ? <div /> : null}
              </div>
            </div>
          ))}
        </div>
      </GeneralModal>
    </Fragment>
  );
}

export default inject("view", "userStore", "languageStore")(observer(Select));
