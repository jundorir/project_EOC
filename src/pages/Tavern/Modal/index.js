// 酒馆
import {Fragment, useEffect, useRef, useState} from "react";
import {inject, observer} from "mobx-react";
import css from "./index.module.less";
import GeneralModal from "@components/Modal/GeneralModal";
import HERO_N from "@assets/images/tavern/hero_n.png"
import HERO_R from "@assets/images/tavern/hero_r.png"
import HERO_SR from "@assets/images/tavern/hero_sr.png"
import HERO_SSR from "@assets/images/tavern/hero_ssr.png"
import useMaterial from "@common/const/define/Material";
function Modal(props) {
    const { list = [], visible, setVisible, languageStore } = props
    const Material = useMaterial(languageStore.language);
    if(!visible) {
        return  null
    }
    function getImg({key, name}) {
    //  .key ? Material[itemList.key]?.images : require("@assets/images/tavern/hero_"+itemList.name.toLowerCase()+".png")
      if(key){
        return Material[key]?.images
      }else if(name === 'R'){
        return  HERO_R
      }else if(name === 'SR'){
        return  HERO_SR
      }else if(name === 'SSR'){
        return  HERO_SSR
      }else if(name === 'N'){
        return  HERO_N
      }
      return  ''
    }
    return (
        <Fragment>
            <GeneralModal
              visible={visible}
              buttonSize={''}
              title={languageStore.language.Probability}
              onCancel={()=>{ setVisible(false)}}
              onConfirm={()=>{ setVisible(false)}}
              confirmText={languageStore.language.OK}
              cancelText={languageStore.language.battle_cancel}
            >
              <div className={css.modalContent}>
                {list.map((item, index)=>(
                  <Fragment key={index}>
                    <div className={css.tit}>{languageStore.language[item.i18n]}</div>
                    <div className={css.box}>
                      {item.list.map((itemList, index)=>(
                        <div key={index} className={css.boxItem}>
                          <div className={css.boxItemImg}>
                            <img src={getImg(itemList)} />
                          </div>
                          <div className={css.boxItemT1}>{Material[itemList.key]?.title || itemList.name}</div>
                          <div className={css.boxItemT2}>{itemList.val}</div>
                        </div>
                      ))}

                      {/*<div className={css.boxItem}>*/}
                      {/*  <div className={css.boxItemImg}>*/}
                      {/*    <img src={Material['SpiritDrug']?.images} />*/}
                      {/*  </div>*/}
                      {/*  <div className={css.boxItemT1}>{Material['SpiritDrug']?.title}</div>*/}
                      {/*  <div className={css.boxItemT2}>10%</div>*/}
                      {/*</div>*/}
                      {/*<div className={css.boxItem}>*/}
                      {/*  <div className={css.boxItemImg}>*/}
                      {/*    <img src={Material['ExperienceBookSenior']?.images} />*/}
                      {/*  </div>*/}
                      {/*  <div className={css.boxItemT1}>{Material['ExperienceBookSenior']?.title}</div>*/}
                      {/*  <div className={css.boxItemT2}>30%</div>*/}
                      {/*</div>*/}
                    </div>
                  </Fragment>
                ))}


              </div>

              {/*<ul className={css.modalContent}>*/}
              {/*  {list.map((item, index)=> (*/}
              {/*    <li key={index}>*/}
              {/*      <label>{item.name}</label>*/}
              {/*      <span>{item.val}</span>*/}
              {/*    </li>*/}
              {/*  ))}*/}
              {/*</ul>*/}
            </GeneralModal>
        </Fragment>
    );
}
export default inject( "languageStore")(observer(Modal));
