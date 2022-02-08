// 联盟
import React, { useEffect, useState } from "react";
import Button from "@components/Button";
import PageContainer from "@components/PageContainer";
import css from "./index.module.less";
import UnionDetail from "../UnionDetailModal";
import UnionCreate from "./UnionCreateModal";
// import InviteModal from "./InviteModal";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import GeneralModal from "@components/Modal/GeneralModal";

function UnionList(props) {
  const {
    chain,
    userStore,
    languageStore: { language },
  } = props;
  const { unionStore } = userStore;
  const { unionList } = unionStore;
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  // useEffect(() => {
  //   if (chain.address && chain.token) {
  //     unionStore.queryUnionList({
  //       user: chain.address,
  //       sign: chain.token,
  //     });
  //   }
  // }, [chain.address, chain.token]);
  // 创建公会
  function createHandle(data) {
    setShowCreate(false);
  }
  // 搜索
  function searchHandle() {
    if (searchString.length > 0) {
      unionStore.reFresh();
      unionStore.queryUnionList(searchString);
    } else {
      // Toast.show({
      //   icon: "fail",
      //   content: "搜索内容不能为空",
      //   duration: 500,
      // });
      GeneralModal.alert({
        title: language.failure,
        content: language.cannot_none,
        confirmText: language.OK,
      });
    }
  }
  //刷新列表
  function refresh() {
    unionStore.reFresh();
    setSearchString("");
    unionStore.queryUnionList();
  }

  function changeHandle({ target: { value } }) {
    setSearchString(value);
  }

  function closeInviteModal() {
    setShowInvite(false);
  }

  // // 接受邀请
  // function acceptHandle(params) {
  //   closeInviteModal();
  // }

  // // 拒接邀请
  // function rejectHandle(params) {
  //   closeInviteModal();
  // }

  return (
    <PageContainer>
      <div className={css.header}>
        <form className={css.input_container}>
          <input
            value={searchString}
            onChange={changeHandle}
            autoComplete="off"
            name="searchText"
            placeholder={language.Enter_guild_name}
            type="text"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              searchHandle();
            }}
            type="submit"
            size="small"
          >
            {language.search}
          </Button>
        </form>
      </div>
      <div className={css.body}>
        <ul>
          {unionList.data.map((item) => (
            <li
              onClick={() => {
                setShowDetail(true);
                setData(item);
              }}
              key={item.id}
            >
              <p className={css.title}>
                <span>
                  {item.name} <span className={css.level}>LV.{item.level}</span>
                </span>
                <span className={css.member_number}>
                  {item.num}/{item.num_high}
                </span>
              </p>
              <div className={css.desc}>
                <span className={css.left}>
                  {/* {item.invite_method === "1" ? "公开制" : "邀请制"} */}
                  {language.Invitation}
                </span>
                <span className={css.right}>
                  {language.territory}：{item.city_name || language.noterritory}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer">
        <div className={css.actions}>
          <Button className={css.button} disabled={userStore.guild_id - 0 > 0}>
            {language.Create_Guild}
            <div
              className={css.layer}
              onClick={(e) => {
                e.stopPropagation();
                if (userStore.guild_id - 0 < 1) {
                  setShowCreate(true);
                }
              }}
            ></div>
          </Button>
          {/* <Button onClick={() => setShowInvite(true)}>公会邀请</Button> */}
          <Button className={css.button}>
            {language.Refresh_List}
            <div
              className={css.layer}
              onClick={(e) => {
                e.stopPropagation();
                refresh();
              }}
            ></div>
          </Button>
        </div>
      </div>
      <UnionDetail
        visible={showDetail}
        data={data}
        onClose={() => setShowDetail(false)}
      />
      <UnionCreate
        visible={showCreate}
        onCancel={() => setShowCreate(false)}
        onConfirm={createHandle}
      />
      {/* <InviteModal
        // data={new Array(10).fill(0)}
        onAccept={acceptHandle}
        onReject={rejectHandle}
        visible={showInvite}
        onConfirm={closeInviteModal}
      /> */}
    </PageContainer>
  );
}

export default inject(
  "chain",
  "userStore",
  "languageStore"
)(observer(UnionList));
