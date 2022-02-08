// 战役
import { Fragment, useEffect, useRef, useState } from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";

function List(props) {
  const { setLevel, userStore, chain } = props;
  const { battleStore } = userStore;
  const { list } = battleStore;
  useEffect(() => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    array.filter((item) => battleStore.getBttleDatasAsync(item));
  }, []);
  const listEl = useRef(null);
  // 当前用户的关卡，默认0
  const [selectedIndex, setSelectedIndex] = useState(battleStore.nowRound - 0);
  /**
   * 获取用户当前关卡
   */
  useEffect(() => {
    if (chain.address) {
      battleStore.nowRoundAsync();
    }
  }, [chain.address]);
  // ---------------------------------------------->
  // 滚动到初始化当前选择的层数
  // useEffect(() => {
  //   if (listEl && listEl.current) {
  //     let listItem = listEl.current.children[0];
  //     let computedStyle = document.defaultView.getComputedStyle(listItem);
  //     let height =
  //       Number(computedStyle.marginBottom.replace("px", "")) +
  //       listItem.clientHeight;
  //     console.log(height);
  //     console.log(height * selectedIndex);
  //     setTimeout(() => {
  //       scrollView(listEl.current, height * (selectedIndex - 1), 0);
  //     }, 0);
  //   }
  // }, [listEl]);
  // // 页面滚动
  // function scrollView(ele, maxHeight, initHeight) {
  //   ele.scrollTo(0, initHeight > maxHeight ? maxHeight : initHeight);
  //   if (maxHeight > initHeight) {
  //     setTimeout(() => {
  //       let addScroll = maxHeight / 200;
  //       if (addScroll < 10) {
  //         addScroll = 10;
  //       }
  //       initHeight = initHeight + addScroll;
  //       if (initHeight > maxHeight) {
  //         maxHeight = initHeight;
  //       }
  //       scrollView(ele, maxHeight, initHeight);
  //     }, 10);
  //   }
  // }

  return (
    <div className={css.list} ref={listEl}>
      {list.map((item, index) => {
        console.log("item------>", item);
        return (
          <ListItem
            {...item}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            index={index}
          />
        );
      })}
    </div>
  );
}
function ListItem(props) {
  const {
    selectedIndex,
    setSelectedIndex,
    index,
    title = "第" + (index + 1) + "层",
    status = 1,
    selected = false,
    firstWinner = "",
    needPower = "0",
    books = 5,
    coin = 5,
    firstReward = [
      {
        type: 3,
        text: "1BTC",
      },
    ],
    reward = [
      {
        type: 2,
        num: 1000,
      },
      {
        type: 1,
        num: 100,
      },
    ],
  } = props;
  console.log("props=======>", props);
  return (
    <div
      className={`${css.listItem} ${status === 2 ? css.listItemDisable : ""}`}
      onClick={() => {
        status === 1 && setSelectedIndex(index);
      }}
    >
      <div
        className={`${css.listContent} ${
          selectedIndex === index ? css.listContentSelected : ""
        }`}
      >
        <p className={css.listTit}>{title}</p>
        <p className={css.listFirst}>
          全服首通:
          {firstWinner !== "0x0000000000000000000000000000000000000000"
            ? firstWinner
            : "暂无"}
        </p>
      </div>
      <p className={css.fightingCapacity}>战斗力 {needPower}</p>
      <div className={css.listFooter}>
        <label className={css.listFooterTit}>
          {firstWinner ? "首通奖励" : "全服首通奖励"}:
        </label>
        <div className={css.reward}>
          经验书：{books}
          EOCC：{coin}
        </div>
        {/* {(firstWinner ? reward : firstReward).map((item, index) => (
          <RewardItem type={item.type} num={item.num} text={item.text} />
        ))} */}
      </div>
    </div>
  );
}
function RewardItem(props) {
  const { type, num, text } = props;
  return (
    <div className={css.reward}>
      <RewardIcon type={type} />
      {text ? <label>{text}</label> : <label>X {num}</label>}
    </div>
  );
}
/**
 * @description 奖励的icon  目前只有EOCC  经验
 * */
function RewardIcon(props) {
  const { type, className = "" } = props;
  let cn = `${css.rewardIcon} ${className || ""}`;
  switch (type) {
    case 1:
      return <div className={`${cn} ${css.rewardIconGold}`}></div>;
    case 2:
      return <div className={`${cn} ${css.rewardIconExperience}`}></div>;
    case 3:
      return <div className={`${cn} ${css.rewardIcon3}`}></div>;
    default:
      return <div className={`${cn}`}></div>;
  }
}
export { RewardItem, RewardIcon };
export default inject("view", "userStore", "chain")(observer(List));
