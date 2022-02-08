import UnionMember from "@components/UnionMember";
import React, { useState, useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import GeneralModal from "@components/Modal/GeneralModal";

function MemberList(props) {
  const {
    chain,
    userStore,
    notShow = false,
    data = [],
    languageStore: { language },
  } = props;
  const { unionStore } = userStore;
  const { unionUserList } = unionStore;
  const [showActionIndex, setShowActionIndex] = useState(null);

  // 获取公会成员
  // useEffect(() => {
  //   if (chain.address && chain.token) {
  //     unionStore.queryGetGuildUserList({
  //       user: chain.address,
  //       guild_id: userStore.guild_id,
  //       sign: chain.token,
  //     });
  //   }
  // }, [chain.address, chain.token]);
  // 当点击会员外部时，关闭会员操作面板
  useEffect(() => {
    document.addEventListener("click", clickHandle);
    return () => {
      document.removeEventListener("click", clickHandle);
    };
  }, []);

  function clickHandle(e) {
    if (!e.target.closest(`.${css.member_item}`)) {
      setShowActionIndex(null);
    }
  }

  function setLeader(item) {
    GeneralModal.confirm({
      content: (
        <div className={css.content}>
          {language.sure_transfer}&nbsp;
          <span style={{ color: "#fde23a" }}>{item.nickname || item.user}</span>
          &nbsp;?
        </div>
      ),
      onConfirm: async () => {
        const result = await unionStore.setGuildMaster(
          // {
          //   user: chain.address,
          //   to_user: item.user,
          //   sign: chain.token,
          // }
          userStore.guild_id,
          item.user
        );
        if (result) {
          unionStore.queryFresh({ guild_id: userStore.guild_id });
          userStore.init();
          GeneralModal.alert({
            content: language.success,
          });
        } else {
          GeneralModal.alert({
            title: language.failure,
            content: language.failure,
          });
        }
      },
    });
  }

  async function setGoOut(item) {
    // console.log("逐出公会成员信息", item);
    GeneralModal.confirm({
      content: (
        <div className={css.content}>
          {language.sure_kick1}&nbsp;
          <span style={{ color: "#fde23a" }}>{item.nickname || item.user}</span>
          &nbsp;{language.sure_kick2}?
        </div>
      ),
      onConfirm: async () => {
        const result = await unionStore.RemoveMember(
          // {
          //   user: chain.address,
          //   to_user: item.user,
          //   sign: chain.token,
          // }
          userStore.guild_id,
          item.user
        );
        if (result) {
          unionStore.queryFresh({ guild_id: userStore.guild_id });
          GeneralModal.alert({
            content: language.success,
          });
        } else {
          GeneralModal.alert({
            title: language.failure,
            content: language.failure,
          });
        }
      },
    });
  }

  const positionData = {
    2: language.Chairman,
    1: language.member,
    0: language.member,
  };
  function renderItem(item, index) {
    return (
      <li
        key={index}
        onClick={() => {
          if (!props.onAction) {
            return;
          }
          setShowActionIndex(index === showActionIndex ? null : index);
        }}
        className={css.member_item}
      >
        <UnionMember
          data={{
            avatar: item.head,
            name: item.nickname || item.user,
            bp: item.power,
            position: positionData[item.position],
          }}
        />
        {userStore.position > 0 && item.user !== chain.address && (
          <div
            style={{ display: index === showActionIndex ? "flex" : "none" }}
            className={css.action}
          >
            {userStore.position > 1 && (
              <p onClick={() => setLeader(item)}>
                {language.President_transfer}
              </p>
            )}
            {userStore.position > 0 && (
              <p onClick={() => setGoOut(item)}>{language.Kick_out}</p>
            )}
          </div>
        )}
      </li>
    );
  }

  const statistic = `${props.num || 0}/${props.total || 0}`;
  return (
    <div className={css.body}>
      <p className={css.title}>
        <span>
          {language.Member_Limit} {props.onAction && statistic}
        </span>
        <span>
          {props.onAction
            ? userStore.position > 0
              ? language.click_manarge
              : ""
            : statistic}
        </span>
      </p>
      <ul className={css.member_list}>
        {data.length > 0
          ? data.map((item, index) => renderItem(item, index))
          : unionUserList.data.map((item, index) => renderItem(item, index))}
      </ul>
    </div>
  );
}
export default inject(
  "chain",
  "userStore",
  "languageStore"
)(observer(MemberList));
