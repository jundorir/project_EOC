import Button from "@components/Button";
import GeneralModal from "@components/Modal/GeneralModal";
import InputModel from "@components/Modal/GeneralModal/InputModel";
import PageContainer from "@components/PageContainer";
import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import MemberList from "../MemberList";
import Notify from "../Notify";
import UnionLogan from "../UnionLogan";
import UnionModifyModal from "../UnionModifyModal";
import css from "./index.module.less";
import Modal from "@components/Modal/BuyModal";

function UnionManage(props) {
  const {
    chain,
    userStore,
    view,
    languageStore: { language },
  } = props;
  const { unionStore, headStore } = userStore;
  const { unionInfo } = unionStore;
  // const [data, setData] = useState({
  //   avatarUrl: unionInfo.avatar_image,
  //   name: unionInfo.name,
  //   id: unionInfo.guild_id,
  //   notice: unionInfo.notice,
  //   gain: unionInfo.bonus + "%", // 公会加成
  // });
  const [showModify, setShowModify] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [signOut, setSignOutGuild] = useState("");

  // 邀请入会
  async function inviteHandle(value) {
    if (!value) {
      GeneralModal.alert({
        content: language.enter_address,
      });
      return;
    }
    try {
      const result = await unionStore.AddMember(
        //   {
        //   user: chain.address,
        //   buser: value.trim(),
        //   sign: chain.token,
        // }
        userStore.guild_id,
        value.trim()
      );
      if (result) {
        unionStore.init({ guild_id: userStore.guild_id });
        // unionStore.queryGetGuildUserList({
        //   user: chain.address,
        //   guild_id: userStore.guild_id,
        //   sign: chain.token,
        // });
        // unionStore.queryGetGuildInfo({
        //   user: chain.address,
        //   guild_id: userStore.guild_id,
        //   sign: chain.token,
        // });
        GeneralModal.alert({
          content: language.success,
          onConfirm: () => {
            setShowInvite(false);
          },
        });
      } else if (result.code === 0) {
        GeneralModal.alert({
          title: language.failure,
          content: result.msg,
        });
      }
    } catch (error) {
      GeneralModal.alert({
        title: language.failure,
        content: language.noAddress,
      });
    }
  }

  // 管理会员
  // function actionHandle(item, order) {
  //   console.log(item, order);
  //   switch (order) {
  //     // 会长转入
  //     case "setLeader":
  //       GeneralModal.confirm({
  //         content: "确认要将会长权限转让给 用户名吗？",
  //         onConfirm: () => {},
  //       });
  //       break;
  //     // 逐出公会
  //     case "gun":
  //       GeneralModal.confirm({
  //         content: "确认要将 用户名 逐出公会吗？",
  //         onConfirm: () => {},
  //       });
  //       break;
  //     default:
  //   }
  // }
  function renderModal() {
    if (signOut === "signOutGuild") {
      return (
        <Modal
          closeModal={() => {
            setSignOutGuild("");
          }}
          impower={language.ancel}
          size={"middle"}
          title={language.confirm}
          confirmText={language.OK}
          content={<p>{language.Exit_sure}?</p>}
          onInpower={() => {
            setSignOutGuild("");
          }}
          onConfirm={async () => {
            try {
              const result = await unionStore.ExitGuild();
              if (result) {
                setSignOutGuild("");
                // 刷新个人信息
                userStore.init();
                view.changeDisplayView("home");
                GeneralModal.alert({
                  content: language.Exit_suc,
                });
              } else {
                setSignOutGuild("");
                GeneralModal.alert({
                  title: language.failure,
                  content: language.failure,
                });
              }
              return;
            } catch (error) {
              // GeneralModal.alert({
              //   title: "Failed",
              //   content: "合约出错",
              // });
            }
          }}
        />
      );
    }
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
              <div className={css.actions}>
                {userStore.position < 2 && (
                  <Button
                    onClick={() => {
                      setSignOutGuild("signOutGuild");
                    }}
                    size="middle"
                  >
                    {language.Exit}
                  </Button>
                )}
                {userStore.position > 0 && (
                  <Button
                    onClick={() => {
                      userStore.position > 0 && setShowModify(true);
                    }}
                    size="middle"
                    onClose={() => {
                      setShowModify(false);
                    }}
                  >
                    {language.Information_Changes}
                  </Button>
                )}
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
          {userStore.position > 0 && (
            <Button
              onClick={() => setShowInvite(true)}
              size="middle"
              disabled={!(userStore.position > 0)}
            >
              {language.Invite_join}
            </Button>
          )}
        </div>
      </div>
      <div className={css.body}>
        <MemberList
          onAction={true}
          total={unionInfo.num_high}
          num={unionInfo.num}
        />
      </div>
      {showModify && <UnionModifyModal onClose={() => setShowModify(false)} />}
      <InputModel
        confirmText={language.Invite}
        showInput
        placeholder={language.Address}
        visible={showInvite}
        title={language.Invite_join}
        onConfirm={inviteHandle}
        clear={!showInvite}
        onCancel={() => setShowInvite(false)}
      >
        <p>{language.enter_address}</p>
      </InputModel>
      {renderModal()}
    </PageContainer>
  );
}

export default inject(
  "chain",
  "userStore",
  "view",
  "languageStore"
)(observer(UnionManage));
