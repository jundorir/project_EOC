import Button from "@components/Button";
import PageContainer from "@components/PageContainer";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import LogModal from "../LogModal";
import MemberList from "../MemberList";
import Notify from "../Notify";
import UnionLogan from "../UnionLogan";
import css from "./index.module.less";

function UnionMain(props) {
  const {
    view,
    userStore,
    chain,
    languageStore: { language },
  } = props;
  const { unionStore, headStore } = userStore;
  const { unionInfo } = unionStore;
  const [showLog, setShowLog] = useState(false);

  // 获取公会详细信息
  // useEffect(() => {
  //   if (chain.address && chain.token) {
  //     unionStore.queryGetGuildInfo({
  //       user: chain.address,
  //       guild_id: userStore.guild_id,
  //       sign: chain.token,
  //     });
  //     unionStore.getGuildUpgradeInfo({ sign: chain.token });
  //   }
  // }, [chain.address, chain.token]);
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
              <div className={css.actions}>
                {/* <Button
                  onClick={() => {
                    view.changeDisplayView("unionBattle", "公会战");
                  }}
                  size="middle"
                >
                  公会战
                </Button> */}
                <Button
                  onClick={() => {
                    view.changeDisplayView("unionmanage", language.Management);
                  }}
                  size="middle"
                >
                  {language.Management}
                </Button>
              </div>
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
        <Notify content={unionInfo.notice} />
        <div className={css.btns}>
          <Button onClick={() => setShowLog(true)}>{language.Log}</Button>
          <Button
            onClick={() => view.changeDisplayView("unionlist", language.Guild)}
          >
            {language.Guild_List}
          </Button>
          <Button
            onClick={() =>
              view.changeDisplayView("uniondonate", language.Donate)
            }
          >
            {language.Donate}
          </Button>
        </div>
      </div>
      <div className={css.body}>
        <MemberList
          total={unionInfo.num_high}
          num={unionInfo.num}
          // data={new Array(10).fill(0)}
        />
      </div>
      <LogModal visible={showLog} onClose={() => setShowLog(false)} />
    </PageContainer>
  );
}

export default inject(
  "view",
  "userStore",
  "chain",
  "languageStore"
)(observer(UnionMain));
