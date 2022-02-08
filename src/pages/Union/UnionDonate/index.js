import Button from "@components/Button";
import PageContainer from "@components/PageContainer";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import UnionLogan from "../UnionLogan";
import memberPng from "@assets/images/union/member.png";
import upPng from "@assets/images/union/up.png";
import coinPng from "@assets/images/union/coin.png";
import css from "./index.module.less";
import GeneralModal from "@components/Modal/GeneralModal";
import { Toast } from "antd-mobile";

function UnionDonate(props) {
  const {
    view,
    userStore,
    chain,
    languageStore: { language },
  } = props;
  const { unionStore, headStore } = userStore;
  const { guildUpgradeInfo, unionInfo } = unionStore;
  const [donateBp, setDonateBp] = useState(unionInfo.currentBp); // 捐献EOCC获得的bP
  const [donateValue, setDonateValue] = useState(""); // 填写的捐献数量

  function changeHandle({ target: { value } }) {
    setDonateValue(value);
  }
  function donateHandle(e) {
    e.preventDefault();
    if (!/^\d+$/.test(donateValue)) {
      GeneralModal.alert({
        content: language.donateTip,
      });
      return;
    }
    if (donateValue - userStore.GOLD > 0) {
      GeneralModal.alert({
        title: language.donateFail,
        content: language.NoBalance,
      });
      return;
    }
    GeneralModal.confirm({
      content: language.AreUSure,
      async onConfirm() {
        const result = await unionStore.queryDotnetGuild(
          unionInfo.guild_id,
          donateValue
        );
        if (result) {
          // Toast.show({
          //   icon: "success",
          //   content: "捐献成功",
          //   duration: 500,
          // });
          setDonateValue("");
          GeneralModal.alert({
            content: language.donateSuc,
          });
          userStore.queryBalance("GOLD");
          unionStore.init({ guild_id: userStore.guild_id });
        } else {
          // Toast.show({
          //   icon: "fail",
          //   content: "捐献失败",
          //   duration: 500,
          // });
          GeneralModal.alert({
            content: language.donateFail,
            title: language.failure,
          });
        }
        // console.log("捐献" + donateValue + "EOCC");
        // const gainDonateBp = 200; // 本次捐献获得的bp
        // const totalBp = data.currentBp + gainDonateBp; // 捐献后的所有bp，用于触发动画
        // setDonateBp(totalBp);
        // // 动画完成后设置总共的bp
        // setTimeout(() => {
        //   setData({
        //     ...data,
        //     currentBp: totalBp,
        //   });
        // }, 1000);
      },
    });
  }
  async function UpLevel() {
    const result = await unionStore.UpgradeLevel(unionInfo.guild_id);
    // console.log("升级结果", result);
    unionStore.init({ guild_id: userStore.guild_id });
  }
  return (
    <PageContainer className={css.container}>
      <div className={css.top}>
        <div className={css.header}>
          <UnionLogan url={headStore.data.unionArray[unionInfo.avatar_image]} />
          <div className={css.content}>
            <div className={css.detail}>
              <div className={css.info}>
                <p className={css.name}>{unionInfo.name}</p>
                <p className={css.id}>ID：{unionInfo.guild_id}</p>
              </div>
              {userStore.position - 0 > 0 && (
                <Button
                  onClick={UpLevel}
                  size="middle"
                  disabled={
                    unionInfo.level >= 10 ||
                    unionInfo.contribution - unionInfo?.next_lv?.contribution <
                      0
                  }
                >
                  {unionInfo.level >= 10
                    ? language.full_level
                    : language.Upgrade}
                </Button>
              )}
            </div>
            <div className={css.value}>
              <span
                style={{
                  width: `${
                    (unionInfo.contribution /
                      unionInfo?.next_lv?.contribution) *
                    100
                  }%`,
                }}
              ></span>
              <span
                className={css.donate_bp}
                style={{ width: `${100}%` }}
              ></span>
            </div>
            <p className={css.level}>
              <span>LV.{unionInfo.level}</span>
              <span>
                {unionInfo.contribution}/{unionInfo?.next_lv?.contribution}
              </span>
            </p>
            <p className={css.adding}>
              <span>{language.Production_Bonus}：</span>
              <span>{unionInfo.bonus}%</span>
            </p>
          </div>
        </div>
      </div>
      <div className={css.next}>
        {unionInfo.level < 10 ? (
          <>
            <span>{language.Next_Unlock}：</span>
            <div className={css.next_item}>
              <img src={memberPng} alt="" />
              <span>
                {language.Member_Limit_Total} {unionInfo?.next_lv?.member}
              </span>
            </div>
            <div className={css.next_item}>
              <img src={upPng} alt="" />
              <span>
                {language.Production_Bonus} {unionInfo?.next_lv?.bonus}%
              </span>
            </div>
          </>
        ) : (
          language.highest_level
        )}
      </div>
      <p className={css.current}>{/* 当前贡献值：{unionInfo.currentBp} */}</p>
      <p className={css.tip}>{language.experience_contribution}</p>
      <br />
      <p className={css.tip}>
        {language.EOCC_Balance}：{userStore.GOLD}
      </p>
      <form className={css.form} action="">
        <img src={coinPng} alt="" />
        <input onChange={changeHandle} type="number" value={donateValue} />
        <Button
          onClick={donateHandle}
          size="middle"
          disabled={unionInfo.level >= 10}
        >
          {unionInfo.level >= 10 ? language.full_level : language.donate}
        </Button>
      </form>
    </PageContainer>
  );
}

export default inject(
  "view",
  "userStore",
  "chain",
  "languageStore"
)(observer(UnionDonate));
