import Button from "@components/Button";
import Dialog from "@components/Dialog";
import React, { useEffect, useState } from "react";
import MemberList from "./MemberList";
import Notify from "../Notify";
import UnionLogan from "../UnionLogan";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import GeneralModal from "@components/Modal/GeneralModal";

function UnionDetail(props) {
  const {
    visible,
    data,
    userStore,
    languageStore: { language },
  } = props;
  const { unionStore, headStore } = userStore;
  const { unionInfo } = unionStore;
  const [members, setMembers] = useState([]);

  // console.log("data", data);
  async function getMembers() {
    const result = await unionStore.queryUnionMembers({
      guild_id: data.guild_id,
    });
    // console.log("查询到的结果", result);
    if (result) {
      setMembers(result?.data);
    }
  }
  useEffect(() => {
    if (visible) {
      getMembers();
    } else {
      setMembers([]);
    }
  }, [visible]);
  // 加入公会
  // async function joinHandle() {
  //   try {
  //     const result = await unionStore.JoinGuild(data.guild_id);
  //     console.log("加入公会结果", result);
  //     if (result) {
  //       await userStore.init();
  //       unionStore.queryFresh({ guild_id: userStore.guild_id });
  //     } else {
  //       GeneralModal.alert({
  //         title: "Failed",
  //         content: "加入失败",
  //         confirmText: "确定",
  //       });
  //     }
  //     return;
  //   } catch (error) {
  //     console.log("合约出错");
  //   }
  // }

  return (
    <Dialog visible={visible} bodyClass={css.body}>
      <div className={css.content}>
        <div className={css.header}>
          <UnionLogan url={headStore.data.unionArray[data.avatar_image]} />
          <div className={css.info}>
            <p className={css.name}>
              {data.name} <span>LV.{data.level} </span>
            </p>
            <p className={css.detail}>
              <span>ID：{data.guild_id}</span>
              <span>
                {language.territory}：{data.city_name || language.noterritory}
              </span>
            </p>
            <div className={css.space}></div>
            <p className={css.system}>
              <span>{language.membership_system}：</span>
              <span>{language.Invitation}</span>
            </p>
            {/* <p className={css.min_condition}>
              <span>最小申请条件：</span>
              <span>power {data.min_bp}</span>
            </p> */}
          </div>
        </div>
        <Notify
          grey
          style={{
            margin: "0 30px",
          }}
          content={data.notice}
        />
        <div className={css.list}>
          <MemberList
            total={data.num_high}
            num={data.num}
            data={members}
            // notShow={true}
            // data={new Array(10).fill(0)}
          />
        </div>
      </div>
      <div className={css.actions}>
        <Button onClick={props.onClose}>{language.ancel}</Button>
        {/* <Button onClick={joinHandle} disabled={userStore.guild_id > 0}>
          加入公会
        </Button> */}
      </div>
    </Dialog>
  );
}

export default inject(
  "view",
  "userStore",
  "chain",
  "languageStore"
)(observer(UnionDetail));
