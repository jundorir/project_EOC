import classNames from "classnames";
import { useEffect, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import css from "./index.module.less";
import MembersModal from "../Modal/MembersModal";
import VictoryModal from "../Modal/VictoryModal";
import Countdown from "./Countdown";
import SignUpCounydown from "./SignUpCounydown";
import Button from "@components/Button";
import BuyModal from "@components/Modal/BuyModal";
import UniontotemSmall from "./UniontotemSmall";
import BottomPlaceholder from "@components/BottomPlaceholder";
import { inject, observer } from "mobx-react";
import GeneralModal from "@components/Modal/GeneralModal";
import TopPlaceholder from "@components/TopPlaceholder";
import icon_gold from "@assets/images/tavern/icon_gold.png";

// 公会战
function Home(props) {
  const { userStore, chain, view } = props;
  const { unionbattleStore, headStore, unionStore } = userStore;
  const { unionInfo } = unionStore;
  const {
    cityyelu,
    cityjunshi,
    citybabilun,
    cityyadian,
    cityluoma,
    citydibisi,
    citydama,
    sign_up_time,
    sign_up_end_time,
    guild_fight_time,
    sign_up,
    sign_up_end,
    guild_fight,
  } = unionbattleStore;
  const [showModal, setShowModal] = useState("");
  function renderModal() {
    if (showModal === "members") {
      return (
        <MembersModal
          closeModal={() => {
            setShowModal("");
          }}
          membersData={unionbattleStore.membersList}
        />
      );
    } else if (showModal === "victory") {
      return (
        <VictoryModal
          closeModal={() => {
            setShowModal("");
          }}
        />
      );
    } else if (showModal === "apply") {
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
                <div>请先进行授权操作</div>
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
              unionbattleStore.getSignUpCountDownAsync();
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
  }
  function renderCity(startIndex, endIndex) {
    const arr = [
      {
        data: cityyelu[0],
        byunion: cityyelu[0]?.guild_name,
        name: "Jerusalem",
        style: `${css.one}`,
        id: 1,
      },
      {
        data: cityjunshi[0],
        byunion: cityjunshi[0]?.guild_name,
        name: "Constantinople",
        style: `${css.two}`,
        id: 2,
      },
      {
        data: citybabilun[0],
        byunion: citybabilun[0]?.guild_name,
        name: "Babylon",
        style: `${css.three}`,
        id: 3,
      },
      {
        data: cityyadian[0],
        byunion: cityyadian[0]?.guild_name,
        name: "Athens",
        style: `${css.four}`,
        id: 4,
      },
      {
        data: cityluoma[0],
        byunion: cityluoma[0]?.guild_name,
        name: "Rome",
        style: `${css.five}`,
        id: 5,
      },
      {
        data: citydibisi[0],
        byunion: citydibisi[0]?.guild_name,
        name: "Thebes",
        style: `${css.six}`,
        id: 6,
      },
      {
        data: citydama[0],
        byunion: citydama[0]?.guild_name,
        name: "Damascus",
        style: `${css.seven}`,
        id: 7,
      },
    ];

    const showArray = arr.slice(startIndex, endIndex);
    return showArray.map((item) => {
      const { data = {}, byunion = "", name = "", style = "", id } = item;
      return (
        <div
          className={css.cityItem}
          key={id}
          onClick={() => {
            // props.changeView("cityDetails", name);
            view.changeCity(data, name, id);
            // view.changeDisplayView("cityDetails");
            props.toCity();
          }}
        >
          <div className={classNames(css.item, style)}></div>
          <div
            className={classNames(
              css.info,
              name === "Jerusalem" && css.infoWidth
            )}
          >
            {byunion ? "由" : "暂无公会占领"} <span>{byunion}</span>{" "}
            {byunion ? "占领" : ""}
          </div>
          <div className={css.tip}>
            分红占比&nbsp;&nbsp;
            <span className={css.tipnum}>
              {name === "Jerusalem" ? 40 : 10}%
            </span>
          </div>
        </div>
      );
    });
  }

  useEffect(() => {
    unionbattleStore.getSignUpAsync();
    unionbattleStore.getSignUpMembersAsync();
    unionbattleStore.getSignUpCountDownAsync();
    let interval = setInterval(() => {
      unionbattleStore.getSignUpCountDownAsync();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  function renderchildren() {
    return (
      <div className={css.headerNum}>
        <img src={icon_gold} alt="" />
        <label>{userStore.GOLD}</label>
      </div>
    );
  }
  function renderSignupTime() {
    if (sign_up_end > 0) {
      return <SignUpCounydown data={sign_up_end_time} title={"报名结束"} />;
    }
    if (sign_up > 0) {
      return <SignUpCounydown data={sign_up_time} title={"报名开始"} />;
    }
  }
  function renderButton() {
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
  return (
    <Fragment>
      <TopPlaceholder children={renderchildren()} />
      <div className={css.contain}>
        {/* 倒计时 */}
        <div className={css.topBox}>
          <Countdown
            title={"开战倒计时"}
            guild_fight_time={guild_fight_time}
            guild_fight={guild_fight}
          />
        </div>
        {/* 城市区域 */}
        <div className={css.scroll}>
          <div className={css.city}>
            <div className={css.top}>{renderCity(1, 4)}</div>
            <div className={classNames(css.middle, css.center)}>
              {renderCity(0, 1)}
            </div>
            <div className={css.bottom}>{renderCity(4, 7)}</div>
          </div>
        </div>
        {/* 报名入口 */}
        <div className={css.regDetailsBox}>
          <div className={css.regDetails}>
            <div className={css.left}>
              <UniontotemSmall
                url={headStore.data.unionArray[unionInfo.avatar_image]}
              />
              <div className={css.leftInfo}>
                <div className={css.name}>{unionInfo.name}</div>
                {sign_up_end > 0 ? (
                  <Fragment>
                    <div className={css.people}>
                      当前已集结：
                      <span className={css.number}>
                        {unionbattleStore.assembled}
                      </span>
                      &nbsp;人
                    </div>
                    {/* 报名倒计时 */}
                    {renderSignupTime()}
                    {unionbattleStore.assembled > 0 && (
                      <div className={css.toView}>
                        查看人员
                        <div
                          className={css.toViewLayer}
                          onClick={() => {
                            setShowModal("members");
                          }}
                        ></div>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {/* <div>报名未开始</div> */}
                    {renderSignupTime()}
                  </Fragment>
                )}
              </div>
            </div>
            <div className={css.right}>
              {renderButton()}
              <div className={css.word}>报名消耗 10000EOCC</div>
            </div>
          </div>
        </div>
        <BottomPlaceholder />
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("view", "userStore", "chain")(observer(Home));
