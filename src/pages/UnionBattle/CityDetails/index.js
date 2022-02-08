import { useState, Fragment, useEffect } from "react";
import css from "./index.module.less";
import Countdown from "./Countdown";
import MembersModal from "../Modal/MembersModal";
import Junshi from "@assets/images/unionBattle/junshi.png";
import Luoma from "@assets/images/unionBattle/luoma.png";
import Babilun from "@assets/images/unionBattle/babilun.png";
import Yadian from "@assets/images/unionBattle/yadian.png";
import Yelu from "@assets/images/unionBattle/yelu.png";
import Dibisi from "@assets/images/unionBattle/dibisi.png";
import Dama from "@assets/images/unionBattle/dama.png";
import Button from "../Components/Button";
import { inject, observer } from "mobx-react";
import BottomPlaceholder from "@components/BottomPlaceholder";
import Union from "../Components/Uniontotem";
import VictoryModal from "../Modal/VictoryModal";
import DefeatModal from "../Modal/DefeatModal";
import BuyModal from "@components/Modal/BuyModal";
import InfomationWindow from "../Components/InfomationWindow";

import Fighting from "./Fighting";
import { Toast } from "antd-mobile";
import GeneralModal from "@components/Modal/GeneralModal";
const CityMap = {
  Athens: {
    title: "雅典",
    image: Yadian,
  },
  Constantinople: {
    title: "君士坦丁堡",
    image: Junshi,
  },
  Rome: {
    title: "罗马",
    image: Luoma,
  },
  Babylon: {
    title: "巴比伦",
    image: Babilun,
  },
  Jerusalem: {
    title: "耶路撒冷",
    image: Yelu,
  },
  Thebes: {
    title: "底比斯",
    image: Dibisi,
  },
  Damascus: {
    title: "大马士革",
    image: Dama,
  },
};

// 公会战
function CityDetails(props) {
  const { chain, userStore, view } = props;
  const {
    unionbattleStore,
    headStore,
    guild_city_id,
    unionStore: { unionInfo },
  } = userStore;
  const {
    fight_time,
    guild_type,
    sign_up_time,
    sign_up_end_time,
    guild_fight_time,
    sign_up,
    sign_up_end,
    guild_fight,
  } = unionbattleStore;
  /**
   *   guild_type === -1  无占领着
   *   guild_type === 0  战斗结束
   *   guild_type === >0  占领结束倒计时
   */
  const [showModal, setShowModal] = useState("");
  const [showCount, setshowCount] = useState(false);
  const [showInfomation, setShowInfomation] = useState(false);
  const [infomation, setInfomation] = useState("");

  // console.log(fight_time, guild_type);
  function renderModal() {
    if (showModal === "VictoryModal") {
      return (
        <VictoryModal
          data={view.cityname}
          closeModal={() => {
            setShowModal("");
          }}
          unionname={unionInfo.name}
          title={"成功占领"}
        />
      );
    }
    // failModal
    if (showModal === "failModal") {
      return (
        <DefeatModal
          visible={true}
          closeModal={() => {
            setShowModal("");
          }}
        />
      );
    }
    if (showModal === "apply") {
      return (
        <BuyModal
          closeModal={() => {
            setShowModal("");
          }}
          content={
            <Fragment>
              <div className={css.isSure}>
                <p></p>
                <div>确认要报名公会战吗？</div>
                {/* <div>请先进行授权操作</div> */}
              </div>
              <div>
                <span>需要消耗</span>
                <span className={css.needMoney}>10000EOCC</span>
              </div>
            </Fragment>
          }
          title={"确认"}
          confirmText={"确认"}
          noInpower={true}
          impowerdisabled={false}
          onConfirm={async () => {
            const result = await unionbattleStore.UnionBattle_signup();
            console.log("报名结果===>", result);
            if (result) {
              setShowModal("");
              unionbattleStore.getSignUpAsync();
              unionbattleStore.getSignUpMembersAsync();
              GeneralModal.alert({
                content: "报名成功",
              });
            }
          }}
          onInpower={() => {
            console.log("授权");
          }}
        />
      );
    }
    if (showModal) {
      return (
        <MembersModal
          closeModal={() => {
            setShowModal("");
          }}
        />
      );
    }
  }
  function renderCity() {
    return (
      <img
        src={CityMap[view.cityname].image}
        alt={CityMap[view.cityname].title}
        className={css.img}
      />
    );
  }
  function renderName() {
    switch (view.cityname) {
      case "Athens":
        return "雅典";
      case "Constantinople":
        return "君士坦丁堡";
      case "Rome":
        return "罗马";
      case "Babylon":
        return "巴比伦";
      case "Jerusalem":
        return "耶路撒冷";
      case "Thebes":
        return "底比斯";
      case "Damascus":
        return "大马士革";
      default:
        return;
    }
  }
  function renderSignupBTN() {
    if (sign_up_end > 0 && unionbattleStore.mySignUp - 0 <= 0) {
      // 报名截止之前 可以报名 我没报名
      return (
        <Button
          children={"公会战报名"}
          onClick={() => {
            setShowModal("apply");
          }}
          className={css.buton}
        />
      );
    }
    // 报名截止之前 可以报名 我已报名
    let tips = "已报名";
    if (sign_up > 0) {
      //结束报名，开战时
      // 如果还在战斗中
      tips = "公会战报名";
      if (guild_fight > 0) {
        // 未开始战斗
        tips = "报名结束";
      }
    }
    return (
      <Button
        children={tips}
        disabled
        onClick={() => {}}
        className={css.buton}
      />
    );
  }
  function renderButton() {
    // console.log(view.cityId === userStore.guild_city_id);
    if (view.cityId - guild_city_id === 0) {
      return (
        <div className={css.buttonBox}>
          <div className={css.inner}>
            <div className={css.firstLine}>
              <Button
                children={"领取奖励"}
                onClick={() => {
                  getFightReward();
                }}
              />
              <Button
                children={"世界地图"}
                onClick={() => {
                  props.toCity();
                }}
              />
            </div>
            <div>
              <Button
                children={"弃城"}
                onClick={() => {
                  abandonedCity();
                }}
                disabled={userStore.position - 2 < 0}
              />
              {renderSignupBTN()}
            </div>
          </div>
        </div>
      );
    }
  }
  async function abandonedCity() {
    const result = await unionbattleStore.abandonedCityAsync(guild_city_id); //city_id
    if (result.code - 1 === 0) {
      GeneralModal.alert({
        content: "弃城成功",
      });
      unionbattleStore.getCityList();
      userStore.queryUserInfo();
      props.toCity();
    } else {
      GeneralModal.alert({
        title: "失败",
        content: result.msg,
      });
    }
  }
  async function toGet(data) {
    console.log(data);
    try {
      const chainResult = await unionbattleStore.getMMR(data);
      if (chainResult) {
        GeneralModal.alert({ content: "领取成功" });
        return;
      }
    } catch {
      Toast.show({ content: "领取失败" });
    }
  }
  async function getFightReward() {
    const awardInfo = await unionbattleStore.receiveAwardMmr(); //city_id
    if (!awardInfo) return;
    if (awardInfo.isRepeat - 0 === 1) {
      console.log(awardInfo);
      setInfomation(awardInfo);
      GeneralModal.confirm({
        title: "提示",
        content: awardInfo.repeatTis,
        confirmText: "确定",
        onConfirm: () => {
          toGet(awardInfo);
        },
      });
    } else if (awardInfo.isRepeat - 0 === 0) {
      try {
        const chainResult = await unionbattleStore.getMMR(infomation);
        if (chainResult) {
          GeneralModal.alert({ content: "领取成功" });
          return;
        }
      } catch {
        Toast.show({ content: "领取失败" });
      }
    }
  }
  useEffect(() => {
    unionbattleStore.getFightCountDownAsync(view.cityId);
    let interval = setInterval(() => {
      unionbattleStore.getSignUpCountDownAsync();
      unionbattleStore.getFightCountDownAsync(view.cityId);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (fight_time <= 0) {
      setshowCount(false);
      return;
    }
    setshowCount(true);
  }, [fight_time]);
  function renderCountDown() {
    let str = "战斗未开始";
    if (guild_fight - 0 > 0) {
      str = "战斗未开始";
    } else if (guild_type - -1 === 0) {
      str = "公会战进行中";
    } else if (guild_type - 0 === 0) {
      str = "战斗结束";
    } else if (guild_type - 1 > 0) {
      str = "占领倒计时";
    }

    return (
      <Countdown title={str} fight_time={fight_time} guild_type={guild_type} />
    );
  }
  function renderMain() {
    return (
      <div className={css.info}>
        {view.citydata?.guild_id - 0 > 0 ? (
          <>
            <span className={css.white}>由</span>
            <span className={css.yellow}>
              &nbsp;&nbsp;{view.citydata?.guild_name}&nbsp;&nbsp;
            </span>
            <span className={css.white}>占领</span>
          </>
        ) : (
          <span className={css.white}>暂无工会占领</span>
        )}

        {guild_city_id > 0 && guild_city_id - view.cityId !== 0 && (
          <div className={css.nowHave}>你的工会已经拥有城池了</div>
        )}
        {view.citydata?.guild_id - 0 > 0 && guild_type - 0 === 0 && (
          <div className={css.onelogan}>
            <Union url={headStore.data.unionArray[unionInfo.avatar_image]} />
          </div>
        )}
        {guild_city_id - 0 === 0 && guild_type - 0 !== 0 && (
          <>
            <Fighting
              showEnemy={view.citydata?.guild_id - 0 > 0}
              enemyData={view.citydata}
              showVS={view.citydata?.guild_id - 0 > 0}
              goback={() => {
                props.toCity();
              }}
            />
            <Button
              children={"开始攻击"}
              disabled={
                userStore.position - 2 < 0 ||
                unionbattleStore.assembled - 0 <= 0
              }
              onClick={async () => {
                const result = await unionbattleStore.guildFightingAsync(
                  view.cityId
                );
                console.log("战斗结果", result);
                if (result.code - 1 === 0) {
                  if (result.data.status - 2 === 0) {
                    setShowModal("VictoryModal");
                    unionbattleStore.getCityList();
                    userStore.queryUserInfo();
                  } else {
                    setShowModal("failModal");
                  }
                } else {
                  Toast.show({
                    icon: "fail",
                    content: "网络请求错误",
                    duration: 500,
                  });
                }
              }}
            />
          </>
        )}
        {}
      </div>
    );
  }
  return (
    <Fragment>
      <div className={css.contain}>
        {/* 倒计时 */}
        <div className={css.top}>
          <p></p>
          {renderCountDown()}
        </div>
        {/* 城市图片 */}
        <div className={css.middle}>
          <div className={css.city}>
            <div className={css.cityImg}>
              {renderCity()}
              <div className={css.name}>
                {/* {renderName()} */}
                {view.cityname}
              </div>
            </div>
            {renderMain()}
          </div>
          {/* {view.cityId - guild_city_id !== 0 &&
            view.citydata?.guild_id - 0 > 0 && (
              <div className={css.noBegin}>工会战未开启</div>
            )} */}
        </div>
        {renderButton()}
        <BottomPlaceholder />
        {renderModal()}
      </div>
      {view.cityId - guild_city_id !== 0 && (
        <div
          className={css.layer}
          onClick={() => {
            props.toCity();
          }}
        ></div>
      )}
    </Fragment>
  );
}

export default inject("chain", "userStore", "view")(observer(CityDetails));
