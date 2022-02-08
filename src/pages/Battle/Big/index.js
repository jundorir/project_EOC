// 战役
import {Fragment, useEffect, useRef, useState} from "react";
import { Toast } from 'antd-mobile'
import classNames from "classnames";
import SelectModal from "../SelectModal";
import Receive from "../Receive";
import * as Api from "@common/api";
import LevelView from "../Level";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import Scroll from "@utils/scroll";
import {queryRoundList} from "@common/api";
import RewardConfirmModal from "@pages/Battle/RewardConfirmModal";
const CountDownSecond = 60;
// 总关卡数量
const LevelCount = 2000;
// 每一个大关卡数量
const LevelGroupCount = 100;
// 每一个难度关卡数量
const DifficultyGroupCount = 500;

let disabledClickBtn = false
function BigView(props) {
  const { view, userStore, chain, languageStore } = props;
  const { power, pp, pp_time, heroStore, receive_gold, round_id, receive_exp, receive_hoe, battleStore } = userStore;
  const Level = [
    {
      title: languageStore.language.battle_TROY,
      count: 100,
      // cur: 50,
      status: 1,
      remark: '已通关',
      index:1
    },
    {
      title: languageStore.language.battle_Hastings,
      count: 500,
      cur: 50,
      status: 0,
      remark: '已通关',
      index:2
    },
    {
      title: languageStore.language.battle_Tour,
      count: 500,
      cur: 50,
      status: 0,
      remark: '已通关',
      index:3
    },
    {
      title: languageStore.language.battle_Leniano,
      count: 500,
      cur: 50,
      status: 0,
      remark: '已通关',
      index:4
    },
    {
      title: languageStore.language.battle_Cressy,
      count: 500,
      cur: 50,
      status: 0,
      remark: '已通关',
      index:5
    },
  ]
  // console.log('round_id:', round_id)
  //用户上阵英雄列表
  const [battleHeroList, setBattleHeroList] = useState([
    ...heroStore.battleHeroFormation,
  ]);
  // 难度关卡
  const [difficultyVal , setDifficultyVal] = useState(1)
  // 可选择的最大难度关卡
  const [difficultyMaxVal , setDifficultyMaxVal] = useState(1)
  const [difficultyData , setDifficultyData] = useState(0)
  // 难度选着弹窗控制
  const [selectVisible, setSelectVisible] = useState(false)
  // 大关卡分组数据
  const [levelGroup, setLevelGroup ] = useState({index: 1});
  // 是否隐藏当前页面
  const [hidden, setHidden] = useState(false)
  // 控制分组关卡的显示
  const [ showBigLevel, setShowBigLevel ] = useState(false)
  // 需要战斗的关卡数量
  const [ fightRoundId, setFightRoundId ] = useState(0)
  // 动画的分组下标
  const [animationIndex, setAnimationIndex] =  useState(-1)
  // 动画执行的分组下标
  const [showAnimationIndex, setShowAnimationIndex] =  useState(-1)
  // 当前用户 上阵英雄的战力
  const [heroPower, setHeroPower] =  useState(0)
  // 领取奖励确认弹窗
  const [rewardVisible, setRewardVisible] =  useState(0)
  // 领取奖励发送链上接口数据
  const [rewardWeb3Data, setRewardWeb3Data] =  useState({})
  // 领取奖励的存储数据对象
  const [rewardReceiveData, setRewardReceiveData] = useState({exp: 0, gold: 0})
  const listEl = useRef(null);

  useEffect(()=> {
    let levelGroupData = sessionStorage.getItem('levelGroup');
    if(levelGroupData) {
      sessionStorage.removeItem('levelGroup');
      setLevelGroup(JSON.parse(levelGroupData))
      setHidden(true)
      setShowBigLevel(true)
    }
  }, [])

  useEffect(()=> {
    // 获取用户战斗关卡数量
    let num = round_id + 1
    let val = Math.ceil(num / DifficultyGroupCount)
    setFightRoundId(num)
    setDifficultyVal(val)
    setDifficultyMaxVal(val)
  }, [round_id])
  /**
   * 设置战力
   * */
  useEffect(()=> {
    if(battleHeroList.length) {
      let power = 0
      battleHeroList.forEach((item)=> {
        power += (item?.power || 0)
      })
      setHeroPower(power)
    }
  },[battleHeroList])

  /**
   * 战场点击
   * */
  function handleLevel(levelData, index){
    let groupStart = (difficultyVal - 1) * DifficultyGroupCount;
    let groupNum = (difficultyVal - 1) * 5 + (index + 1)
    let startLevel = groupStart + index * LevelGroupCount;
    let endLevel = groupNum * LevelGroupCount;
    // 下一关 是否大于当前关卡第一关
    if(fightRoundId > startLevel){
      let levelCur = 1;
      if(fightRoundId > startLevel && fightRoundId < endLevel){
        levelCur = fightRoundId - startLevel
      } else {
        levelCur = 100
      }
      setLevelGroup({
        ...levelData,
        index,
        levelType: index + 1, // 当前类型 1 - 5
        levelIndex: difficultyVal * 5,
        groupNum, // 当前光卡  分组 1 - 20
        levelCur, //当前关卡的所在关卡数
        startLevel, // 当前关卡开始关数
        endLevel, // 当前关卡结束关数
        fightRoundId
      })
      setHidden(true)
      setShowBigLevel(true)
    }
  }

  /**
   * 隐藏关卡  显示战役
   * */
  function hiddenLevel() {
    setHidden(false)
    setShowBigLevel(false)
  }

  // 难度选着
  function handleDifficulty(data) {
    if(data.val > difficultyMaxVal) {
      // return
    }
    setDifficultyVal(data.val)
    setDifficultyData(data)
    setSelectVisible(false)
  }
  /**
   * @description 获取进度
   * */
  function getProgress (startLevel, index){
    let num = (fightRoundId -1)  - (index * LevelGroupCount + startLevel)
    let start = index * LevelGroupCount + startLevel
    let end = index * LevelGroupCount + startLevel +LevelGroupCount;
    if(num >= 100){
      return {
        text : '100/100',
        width: '100%'
      }
    }else {
      return {
        text : num + '/100',
        width: num / 100  * 100+'%'
      }
    }
  }

  /**
   * 分组通关
   * */
  function levelClearance() {
    hiddenLevel()
    const { index } = levelGroup;
    if(index > 1){
      Scroll.scrollByY({ele:listEl.current, max: window.innerWidth * 0.5})
    }
    setTimeout(()=>{
      setAnimationIndex(index + 1);
      setTimeout(()=> {
        setShowAnimationIndex(index +1)
        setTimeout(()=>{
          setAnimationIndex(-1);
        }, 300)
      },200)
    })

  }
  const startLevel = (difficultyVal - 1) * DifficultyGroupCount;
  /**
   * @description 获取奖励
   *
   */
  async function receiveAwardExpAndGold() {
    // console.log('receiveAwardExpAndGold')
    if(!receive_gold && !receive_exp && !receive_hoe) {
      return
    }
    if(disabledClickBtn){
      return
    }
    disabledClickBtn = true
    setRewardVisible(1)
    const res = await Api.receiveAwardExpAndGold(chain.address ).catch(()=>{
      setRewardVisible(0)
      Toast.show(languageStore.language.net_wrang)
    }).finally(()=>{
      disabledClickBtn = false
    });
    if(res.code === 1) {
      const {param1Hex, param2Hex, param3Hex, idx, sign, param1, param2, param3, isRepeat, repeatTis} = res.data;
      setRewardReceiveData({
        exp: parseInt(param1),
        gold: parseInt(param2),
        hoe: parseInt(param3),
        isRepeat,
        repeatTis,
        // rewardData
      })
      setRewardWeb3Data({
        expHex: param1Hex,
        goldHex: param2Hex,
        hoeHex: param3Hex,
        idx,
        sign
      })
    }else {
      setRewardVisible(0)
      Toast.show(res?.msg || languageStore.language.net_wrang)
    }
  }

  async function getExpAndGold(){
    const { expHex, goldHex, hoeHex, idx, sign } = rewardWeb3Data
    if(!expHex){
      return false
    }
    const result = await battleStore.receiveAwardExpAndGold(expHex, goldHex, hoeHex, idx, sign)
    if(result) {
      setRewardVisible(2)
      setRewardWeb3Data({})
      userStore.queryUserInfo()
    }else {

    }
  }


  return (
    <Fragment>
      <div className={classNames(css.pageMain, hidden ? css.pageMainHidden : '')}>
        <div className={css.pageHeader} >
          <div className={css.pageHeaderLeft}>
            <div className={css.select} onClick={()=>{setSelectVisible(true)}}>
              <span>{languageStore.language.battle_difficulty_du}:</span>
              <label>{difficultyData.title}</label>
            </div>
            <div className={css.heroPower} ><span>Power:</span><label>{heroPower}</label></div>
          </div>

          <div className={css.levelBox}>{pp}/{50}</div>
        </div>
        <div className={css.pageContent} >
          <div className={css.pageContentMain} ref={listEl}>
            <div className={css.mainList} >
              {Level.map((item, index)=> (
                <div className={css.bigItem} key={index} onClick={()=> { handleLevel(item, index)}}>
                  <div className={css.title}>{item.title}</div>
                  {(fightRoundId < ( startLevel + (LevelGroupCount* index) + 1)  || animationIndex === index )?
                    <Fragment>
                      <div className={css.itemMask}>
                        <div className={`${css.itemMaskLeft} ${showAnimationIndex ===  index ? css.itemMaskLeftMove : ''}`}></div>
                        <div className={`${css.itemMaskRight} ${showAnimationIndex ===  index ?css.itemMaskRightMove : ''}`}></div>
                      </div>
                      <div className={css.desc}>{languageStore.language.battle_unlocked}</div>
                    </Fragment>
                    :
                    <Fragment>
                      <div className={css.desc}>{languageStore.language.battle_Degree_completion}:<label>{getProgress(startLevel, index).text}</label></div>
                      <div className={css.progress}>
                        <div className={css.progressLine} style={{width: getProgress(startLevel, index).width}}></div>
                      </div>
                      <div className={css.remark}>{fightRoundId >  (startLevel +  LevelGroupCount * (index +1)) ? languageStore.language.battle_Cleared : languageStore.language.battle_Not_cleared}</div>
                    </Fragment>
                  }
                </div>
              ))}
            </div>

          </div>
        </div>
        <Receive receiveAwardExpAndGold={receiveAwardExpAndGold}/>
        <div
          className={css.footerBtn}
          onClick={() => {
            view.changeDisplayView("battleExplain");
          }}
        />
        <SelectModal visible={selectVisible} selectVal={difficultyVal} setVisible={setSelectVisible} difficultyMaxVal={difficultyMaxVal} handleDifficulty={handleDifficulty}/>
      </div>
      <LevelView receiveAwardExpAndGold={receiveAwardExpAndGold} heroPower={heroPower} visible={showBigLevel} levelGroup={levelGroup} fightRoundId={fightRoundId} addFightRoundId={setFightRoundId} levelClearance={levelClearance} back={hiddenLevel}/>
      <RewardConfirmModal getExpAndGold={getExpAndGold} visible={rewardVisible} title={'奖励'} btnText={'领取'} rewardData={rewardReceiveData} setVisible={()=> {setRewardVisible(0)}} />
    </Fragment>
  );
}

export default inject("view", "userStore", "chain", 'languageStore')(observer(BigView));
