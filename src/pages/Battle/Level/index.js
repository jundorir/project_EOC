// 战役
import {Fragment, useEffect, useRef, useState} from "react";
import { Toast } from 'antd-mobile'
import * as Api from "@common/api";
import classNames from "classnames";
import RewardModal from "../RewardModal";
import DefeatModal from "../DefeatModal";
import FightingModal from "../FightingModal";
import LevelModal from "../LevelModal";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import Receive from "../Receive";
import HintModal from "@pages/Battle/HintModal";
import Button from "@components/Button";
let canClick = true;
let sendRequestLoading = false;
function LevelView(props) {
  const appWidth = document.querySelector('#app').clientWidth
  const itemHeight = appWidth* 0.333;
  const {  userStore , levelGroup, visible, back, chain, fightRoundId, addFightRoundId, heroPower, levelClearance, receiveAwardExpAndGold, languageStore } = props;
  const { power, pp, pp_time, round_id, receive_gold, receive_exp } = userStore;
  //  控制奖励弹窗
  const [rewardVisible, setRewardVisible] = useState(false);
  const [defeatVisible, setDefeatVisible] = useState(false);
  // 关卡点击  弹窗
  const [levelModalVisible, setLevelModalVisible] = useState(false)
  const [fightModalVisible, setFightModalVisible] = useState(false)

  //  战斗动画弹窗
  const [fightingVisible, setFightingVisible] = useState(false);
  //  战力不足弹窗
  const [hintVisible, setHintVisible] = useState(false);
  // 关卡列表
  const [levelList, setLevelList] =  useState([])
  // 用户当前关卡
  const [levelIndex, setLevelIndex] =  useState(1)
  // 是否自动显示下一关
  const [autoNext, setAutoNext] =  useState(false)


  const [showAnimationIndex, setShowAnimationIndex] =  useState(-1)
  const [levelData, setLevelData] =  useState({})
  const [fightData, setFightData] =  useState(false)
  const [bossData, setBossData] =  useState({})


  const listEl = useRef(null);

  // 请求数据 & 控制关卡选择初始化为第一关卡
  useEffect(()=> {
    const { startLevel , groupNum } = levelGroup
    console.log("levelGroup:", levelGroup)
    console.log("本关卡 为第:【" + groupNum + '】大关卡')
    console.log("本关卡 起始关卡:" + startLevel)
    if(!groupNum){
      return false
    }
    Api.queryRoundList(groupNum, 100).then(res=> {
      if(res && Array.isArray(res)){
        let levelCur = gerLevelCur(levelGroup)
        setLevelIndex(levelCur)
        setLevelList(res)
      }
    })
  }, [levelGroup])

  function gerLevelCur(levelGroup) {
    let levelCur;
    const {startLevel, endLevel } = levelGroup
    if(fightRoundId > startLevel && fightRoundId < endLevel){
      levelCur = fightRoundId - startLevel
    } else {
      levelCur = 100
    }
    if(levelCur < 0){
      levelCur = 0
    }
    return levelCur
  }

  /**
   * @description 显示&有数据的时候  初始化显示
   * */
  useEffect(()=>{
    if(visible && levelList.length > 0){
      listEl.current.scrollTo(0, 0)
      const { startLevel , groupLevel} = levelGroup
      let levelIndex = fightRoundId  - startLevel
      if(levelIndex > 0 ) {
        if(levelIndex < 101) {
          // 滚动到对应区域
          listEl.current.scrollTo(0, levelIndex* itemHeight  - itemHeight * 1.8)
          // 显示云朵打开动画
          setTimeout(()=> {
            setShowAnimationIndex(levelIndex)
          },100)
        }else {
          // 滚动到对应区域
          listEl.current.scrollTo(0, 0)
        }

      }else {
// 滚动到对应区域
        listEl.current.scrollTo(0, 0)
      }


    } else {
      setShowAnimationIndex('')
    }
  }, [visible, levelList, levelGroup])




  /**
   * @description  关卡点击
   * */
  function handleLevel(levelData, levelRoundId, index){
    // 如果当前关卡 未解锁 不做处理
    if(levelRoundId > round_id + 1) {
      // Toast.show({
      //   content: '当前关卡还未解锁',
      //   afterClose: () => {
      //     console.log('after')
      //   },
      // })
      return false
    }
    // 当前英雄战力为0（无上阵英雄的时候）  || levelData.power > heroPower
    if(heroPower === 0) {
      setHintVisible(true)
      return  false
    }
    setLevelData({
      ...levelData,
      levelRoundId,
      isNewRoundId: levelRoundId === round_id + 1, //打的是否是最新关卡
      title: levelGroup.groupNum + '-' + (index + 1) // 弹窗显示标题
    })
    setLevelModalVisible(true)
  }


  /**
   * @description 显示下一个关卡
   * */
  function showNextLevel() {
    const {isNewRoundId, levelRoundId } = levelData
    if(isNewRoundId) {
      let newUserRoundId = levelRoundId + 1
      setLevelIndex(levelIndex +1)
      addFightRoundId(newUserRoundId)
      setShowAnimationIndex(newUserRoundId)
      // 通关
      if(newUserRoundId > levelGroup.endLevel) {
        levelClearance(newUserRoundId)
      }
      scrollView(0 ,  appWidth* 0.35)
    }
  }


  /**
   * @description  战役结束 根据战斗结果 进行显示
   * */
  function fightOver(status, data){
    setFightModalVisible(false)
    // 成功展示
    if(status === 1){
      setRewardVisible(true)
    }else{
      // 失败展示
      setDefeatVisible(true)
    }
  }
  /**
   * @description  战斗奖励弹框显示后回调，如果战力满足  需要把下一关显示出来
   * */
  function rewardModalCall(){
    setRewardVisible(false)
    setTimeout(()=>{
      showNextLevel()
      // listEl.current.scrollBy(0, appWidth* 0.35)
    }, 10)
  }

  /**
   * @description 页面滚动  用于关卡通关后  页面滚动到下一个关卡
   * */
  function scrollView(init, max) {
    init = init + appWidth* 0.01;
    if(init > max){
      init = max
      listEl.current.scrollBy(0, appWidth* 0.01)
      return null
    }
    listEl.current.scrollBy(0, appWidth* 0.01)
    return requestAnimationFrame(()=> scrollView(init, max))
  }

  /**
   * @description 去战斗， 存储接口返回数据，  执行战斗动画
   * */
  function toFight(roundId, bossData, call){
    if(sendRequestLoading) {
      return
    }
    sendRequestLoading = true;
    Api.combat(chain.address, roundId, chain.token).then((res)=>{
      if(res.code === 1 || res.code === 11){
        userStore.queryUserInfo()
        call()
        setFightData(res.code === 1)
        setBossData(bossData)
        setLevelModalVisible(false)
        setFightModalVisible(true)
      } else {
        setFightData(false)
        if(res.code === 10){
          call(res.data * 1000)
          return false
        }
        userStore.queryUserInfo()
        Toast.show(res.msg)
      }
    }).catch((err)=>{
      Toast.show(languageStore.language.net_wrang)
      console.log(err)
    }).finally(()=>{
      sendRequestLoading = false
    })

  }
  function getLevelCur(levelIndex) {
    if(fightRoundId < levelGroup.startLevel) {
      return 0;
    } else if(fightRoundId > levelGroup.endLevel){
      return  100
    } else {
      return levelIndex - 1
    }
  }
  return (
    <div className={classNames(css.pageMain, visible ? css.pageMainShow : '')}>
      <div className={css.pageHeader} >
        <div className={css.select} >
          <div className={css.selectText1}><span>{languageStore.language.battle_Degree_completion}:</span><label>{getLevelCur(levelIndex)}/{100}</label></div>
          <div className={css.selectText2}><span>Power</span><label>{heroPower}</label></div>
        </div>
        <div className={css.levelBox}>{pp || 0}/50</div>
      </div>
      <div className={css.pageContent} >
        <div className={css.pageContentMain} ref={listEl}>
          <div className={classNames(css.mainList, css['mainList'+ levelGroup.levelType])} >
            {levelList.map((item, index)=> (
              <div className={css.levelItem} key={index} onClick={()=> { handleLevel(item, levelGroup.startLevel + index +1,  index)}}>
                <div className={classNames(css.levelItemHeader, css['levelItemHeader'+ levelGroup.levelType])}>{levelGroup.groupNum}-{index + 1}</div>
                <div className={css.levelItemHeaderFooter}></div>
                { fightRoundId <= levelGroup.startLevel + index + 1 ?
                  <Fragment>
                    <div className={css.itemMask}>
                      <div className={`${css.itemMaskLeft} ${showAnimationIndex ===  (index+ 1) ? css.itemMaskLeftMove : ''}`}></div>
                      <div className={`${css.itemMaskRight} ${showAnimationIndex ===  (index+ 1) ?css.itemMaskRightMove : ''}`}></div>
                    </div>
                  </Fragment>
                  : null
                }
              </div>
            ))}
          </div>

        </div>
      </div>

      <Receive receiveAwardExpAndGold={receiveAwardExpAndGold}/>
      <div className={css.pageFooter} >
        <div className={css.route}>{levelGroup.title}</div>
        <div
          className={css.back}
          onClick={() => {
            back()
          }}
        />
      </div>
      <RewardModal visible={rewardVisible} levelData={levelData} setVisible={rewardModalCall} />
      <DefeatModal visible={defeatVisible} setVisible={setDefeatVisible} />
      {levelModalVisible ? <LevelModal visible={levelModalVisible} levelData={levelData} levelGroup={levelGroup} callback={fightOver} toFight={toFight} setVisible={setLevelModalVisible} /> : null}
      <HintModal visible={hintVisible} heroPower={heroPower} setVisible={setHintVisible} />
      {fightModalVisible ? <FightingModal bossData={bossData} fightData={fightData} visible={true} callback={fightOver} />: null }
      {/*{fightModalVisible ? <Fighting visible={fightModalVisible} callback={fightOver} /> : null }*/}
    </div>
  );
}

export default inject("view", "userStore", "chain", "languageStore")(observer(LevelView));
