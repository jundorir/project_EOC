// 战役
import React, {Fragment, useEffect, useRef, useState} from "react";
import Button from "@components/Button";
import GeneralModal from "@components/Modal/GeneralModal";
import HeadPortrait from "@components/HeadPortrait";
import * as Api from "@common/api";
import classNames from "classnames";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import Material from "@common/const/define/Material";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import level_first_user from "@assets/images/battle/level_first_user.png"
import Lightning from "@assets/images/battle/lightning2.png";
import useMaterial from "@common/const/define/Material";
// 战役间隔倒计时秒
const CountDownSecond = 30;
let timeout = null;
function View(props) {
  const {visible, setVisible, view, toFight, levelData, levelGroup, userStore, languageStore} = props
  const { heroStore, headStore, pp } = userStore
  const Material = useMaterial(languageStore.language);
  const [ heroData, setHeroData] = useState({})
  const [heroList, setHeroList] = useState([
    ...heroStore.config,
  ]);
  //  倒计时显示字符串
  const [countDownStr, setCountDownStr] = useState("");
  //  倒计时时间
  const [countDownSecond, setCountDownSecond] = useState(-1);
  //  战斗按钮是否置灰
  const [fightingBtnDisable, setFightingBtnDisable] = useState(false);

  const { levelRoundId } = levelData
  // 倒计时
  useEffect(() => {
    if (countDownSecond > -1) {
      if (countDownSecond > 0) {
        setCountDownStr(getTimeStr(countDownSecond));
        timeout = setTimeout(() => {
          let time = countDownSecond - 1;
          setCountDownSecond(time);
        }, 1000);
      } else {
        setCountDownSecond(-1);
        setCountDownStr("");
        setFightingBtnDisable(false);
        localStorage.removeItem("countDownSecondTime");
      }
    }
  }, [countDownSecond]);

  /**
   * @description 进入的时候判断是否再次显示倒计时
   * */
  useEffect(() => {
    let countDownSecondTime = localStorage.getItem("countDownSecondTime");
    if (countDownSecondTime) {
      countDownSecondTime = Number(countDownSecondTime);
      let s = Math.floor((Date.now() - countDownSecondTime) / 1000);
      if (s <= CountDownSecond) {
        setCountDownSecond(CountDownSecond - s);
        setFightingBtnDisable(true);
      }
    }
    return ()=> {
      clearTimeout(timeout)
    }
  }, []);
  /**
   * @description 倒计时显示字符串
   * */
  function getTimeStr(second) {
    let str = "";
    let m = Math.floor(second / 60);
    let s = second % 60;
    if (!m) {
      str += "00";
    } else {
      str += m < 10 ? "0" + m : m;
    }
    str += ":" + (s < 10 ? "0" + s : s);
    return str;
  }
  useEffect(()=> {
    getBoosHero();
  }, [heroList])


  if (!visible) {
    return null;
  }
  function getBoosHeroByLevel(herolevel){
    return heroList.filter((item)=> item.herolevel === herolevel)
  }
  function getBoosHero(){
    let level = levelRoundId % 500
    let herolevel = 1;
    if(herolevel > 490) {
      herolevel = 5
    }else if(herolevel > 450){
      herolevel = 4
    }else if(herolevel > 360){
      herolevel = 3
    }else if(herolevel > 200){
      herolevel = 2
    }
    let heroList = getBoosHeroByLevel(herolevel) || []
    heroList =  heroList.sort((item)=> {
      return  Math.random() > 0.5 ? -1 : 1
    })
    let hero = heroList[0] ||{}
    setHeroData({
      ...hero,
      basepower:  levelData.power
    })
  }
  /**
   * @description PK接口调用后的回调
   * */
  function handleFight() {
    toFight(levelData.round_id, heroData, (time)=> {
      let second = CountDownSecond, nowTime = Date.now();
      // 后端返回的战斗发起时间  当两次间隔不满足 设定时间（60s）的时候  显示倒计时
      if(time) {
        nowTime = time
        second = CountDownSecond - Math.ceil((Date.now() - time) / 1000)
      }
      // 发起战役成功后的调用
      setFightingBtnDisable(true);
      // setFightingVisible(true);
      // 设置发起战役后的倒计时
      setCountDownSecond(second);
      // 监听下次进入  是否显示倒计时
      localStorage.setItem("countDownSecondTime", nowTime);
    })
  }
  function getConfirmBtn(countDownStr, pp) {
    if(countDownStr){
      return countDownStr
    } else if(pp < 1){
      return  <Fragment><label className={css.ppZero} >{languageStore.language.battle_pp_zero}</label></Fragment>
    }else{
      return (
        <Fragment>
          <label>{languageStore.language.battle_battle_fight}</label>
          <img src={Lightning} />
          <label>-1</label>
        </Fragment>
      )
    }
  }
  function FooterContent(props) {
    const {fightingBtnDisable, pp, countDownStr, languageStore, view, onCancel, handleFight } = props
    return (
      <div className={css.footer}>

      <Button onClick={props.onCancel} size={''} onClick={()=> {
        sessionStorage.setItem('levelGroup', JSON.stringify(levelGroup))
        view.changeDisplayView("battleFormation");
      }}>{languageStore.language.battle_arrangement}</Button>
      <Button
        disabled={fightingBtnDisable || pp < 1}
        size={''}
        onClick={()=> {
          handleFight()
        }}
      >
        {getConfirmBtn(countDownStr, pp)}

      </Button>
    </div>
    )
  }
  return (
    <GeneralModal
      visible={true}
      title={<label className={css.tit}>{levelData.title}</label>}
      showTexture={false}
      footer={<></>}
      onCancel={()=> {setVisible(false)}}
      footerContent={<FooterContent fightingBtnDisable={fightingBtnDisable} pp={pp} countDownStr={countDownStr} languageStore={languageStore} view={view} onCancel={()=> {setVisible(false)}} handleFight={handleFight}/>}
    >
      <div className={css.levelModal}>
        <div className={css.firstUser}>
          <div className={css.firstUserIcon}>
            <div>
              {headStore.data.headArray[userStore.head_id] ?
                <HeadPortrait
                  IMG={headStore.data.headArray[userStore.head_id]}
                  onClick={() => {
                    // props.profil("myProfile");
                  }}
                />
                : null
              }
            </div>

          </div>
          <div className={css.firstUserName}>
            <div>{languageStore.language.battle_Full_service}:</div>
            <label>{levelData.first_pass_user || languageStore.language.battle_first_pass_user_null}</label>
          </div>
        </div>
        <div className={css.middle}>
          <div className={css.middleTit}><div>{languageStore.language.battle_Boss_pass}</div><label>{heroData.heroName}</label></div>
          <div className={css.middleHero}>
            <div className={css.middleHeroItem}>
              <div className={css.middleHeroItemScale}>
                {heroData.head_url ? <HeroThumbnail hero={heroData} showTitle={false} showStatus={false} checked={false}/> : null}
              </div>
            </div>
          </div>
          <div className={css.middleDesc}>{languageStore.language.battle_Recommended}:<label>{levelData.power}</label></div>
        </div>
        <div className={css.prize}>
          {/*<div className={css.prizeTit}>首通奖励:</div>*/}
          {/*<div className={css.prizeBox}>*/}
          {/*  <div className={classNames(css.prizeItem, levelData.first_pass ? css.prizeItemGray : '')}>*/}
          {/*    <div>*/}
          {/*      <img src={levelData.icon || Material['ExperienceBookPrimary']?.images} />*/}
          {/*    </div>*/}
          {/*    <label>{levelData.first_pass_text}</label>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className={css.prizeTit}>{languageStore.language.battle_Battle_reward}:</div>
          <div className={css.prizeBox}>
            {levelData.exp ?
              <div className={css.prizeItem}>
                <div>
                  <img src={Material['ExperienceBookPrimary']?.images} />
                </div>
                <label>X {levelData.exp}</label>
              </div>
              : null }
            {levelData.gold ?
              <div className={css.prizeItem}>
                <div>
                  <img src={Material['Gold']?.images} />
                </div>
                <label>X {levelData.gold}</label>
              </div>
              : null }
          </div>
        </div>
      </div>
    </GeneralModal>
  )
}

export default inject("view", "userStore", "languageStore")(observer(View));
