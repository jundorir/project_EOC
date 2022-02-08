// 战役
import { Fragment, useEffect, useState } from "react";
import Button from "@components/Button";
import List from "./List";
import RewardModal from "./RewardModal";
import HintModal from "./HintModal";
import FightingModal from "./FightingModal";
import GeneralModal from "@components/Modal/GeneralModal";
import Fighting from "@components/Fighting";
import css from "./index.module.less";
import ButtonBg from "@assets/images/components/button/bg2.png";
import Lightning from "@assets/images/battle/lightning2.png";
import { inject, observer } from "mobx-react";
const CountDownSecond = 60;
function Battle(props) {
  const { view, userStore } = props;
  const { battleStore } = userStore;
  //  控制奖励弹窗
  const [rewardVisible, setRewardVisible] = useState(false);
  //  战斗动画弹窗
  const [fightingVisible, setFightingVisible] = useState(false);
  //  战力不足弹窗
  const [hintVisible, setHintVisible] = useState(false);
  //  当前选择的层级数据
  const [levelData, setLevelData] = useState(null);
  //  倒计时显示字符串
  const [countDownStr, setCountDownStr] = useState("");
  //  倒计时时间
  const [countDownSecond, setCountDownSecond] = useState(-1);
  //  战斗按钮是否置灰
  const [fightingBtnDisable, setFightingBtnDisable] = useState(false);

  /**
   * @description 战役点击
   * */
  async function fight(roundid = 3) {
    if (fightingBtnDisable) {
      return;
    }
    const result = await battleStore.attackAsync(roundid);
    if (result) {
      //todo 随机数自测  后续自行替换  战斗力够才能发起战役

      // 发起战役成功后的调用
      setFightingBtnDisable(true);
      // setFightingVisible(true);
      // 设置发起战役后的倒计时
      setCountDownSecond(CountDownSecond);
      // 监听下次进入  是否显示倒计时
      sessionStorage.setItem("countDownSecondTime", Date.now());
    } else {
      // 显示战力不住弹窗
      setHintVisible(true);
    }
  }
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
  /**
   * @description 战斗动画执行完后的回调
   * */
  function fightingCallback() {
    setFightingVisible(false);
    setRewardVisible(true);
  }
  // 倒计时
  useEffect(() => {
    if (countDownSecond > -1) {
      if (countDownSecond > 0) {
        setCountDownStr(getTimeStr(countDownSecond));
        setTimeout(() => {
          let time = countDownSecond - 1;
          setCountDownSecond(time);
        }, 1000);
      } else {
        setCountDownSecond(-1);
        setCountDownStr("");
        setFightingBtnDisable(false);
        sessionStorage.removeItem("countDownSecondTime");
      }
    }
  }, [countDownSecond]);

  /**
   * @description 进入的时候判断是否再次显示倒计时
   * */
  useEffect(() => {
    let countDownSecondTime = sessionStorage.getItem("countDownSecondTime");
    if (countDownSecondTime) {
      countDownSecondTime = Number(countDownSecondTime);
      let s = Math.floor((Date.now() - countDownSecondTime) / 1000);
      if (s <= CountDownSecond) {
        setCountDownSecond(CountDownSecond - s);
        setFightingBtnDisable(true);
      }
    }
  }, []);
  return (
    <div className={css.pageMain}>
      <div className={css.pageHeader}>
        <div className={css.levelBox}>50/50</div>
      </div>
      <div className={css.pageContent}>
        <List setLevel={setLevelData} />
      </div>
      <div className={css.pageFooter}>
        <div className={css.ctrls}>
          <div className={css.ctrlItem}>
            <Button
              onClick={() => {
                view.changeDisplayView("battleFormation");
              }}
            >
              布阵
            </Button>
          </div>
          <div className={css.ctrlItem}>
            <Button
              disabled={fightingBtnDisable}
              onClick={() => {
                fight();
              }}
            >
              <div className={css.ctrlItemFight}>
                <label>FIGHT</label>
                <img src={Lightning} />
                <label>-1</label>
              </div>
            </Button>
          </div>
        </div>
        <div className={css.timeBtn}>
          {countDownStr ? (
            <Button
              style={{
                background: `url(${ButtonBg})`,
                "background-size": "contain",
                color: "#fff",
              }}
            >
              {countDownStr}
            </Button>
          ) : null}
        </div>
      </div>
      <RewardModal visible={rewardVisible} setVisible={setRewardVisible} />
      <FightingModal visible={fightingVisible} callback={fightingCallback} />
      <HintModal visible={hintVisible} setVisible={setHintVisible} />
      <div
        className={css.footerBtn}
        onClick={() => {
          view.changeDisplayView("battleExplain");
        }}
      ></div>
      {/*<Fighting />*/}
    </div>
  );
}

export default inject("view", "userStore")(observer(Battle));
