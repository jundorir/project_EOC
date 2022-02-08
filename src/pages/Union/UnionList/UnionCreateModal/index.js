import Input from "@components/Input";
import GeneralModal from "@components/Modal/GeneralModal";
import UnionLogan from "@pages/Union/UnionLogan";
import React, { useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import Button from "@components/Button";
import { Toast } from "antd-mobile";
import Modal from "@components/Modal/BuyModal";

function UnionCreate(props) {
  const {
    chain,
    userStore,
    languageStore: { language },
  } = props;
  const { onCancel, onConfirm, ...reset } = props;
  // console.log(onCancel);
  const [showModal, setShowModal] = useState("");
  const [MMR_APPROVEMENT, setMMR_APPROVEMENT] = useState(
    userStore.MMR_APPROVEMENT
  );
  // const [GUILDTOKEN_APPROVEMENT, setGUILDTOKEN_APPROVEMENT] = useState(
  //   userStore.GUILDTOKEN_APPROVEMENT
  // );
  async function toApproveMMR() {
    const result = await userStore.toApprove("MMR");
    console.log("授权结果====》", result);
    if (result) {
      const { approvement, status } = result;
      if (status) {
        setShowModal("");
        // Toast.show({
        //   icon: "success",
        //   content: `授权MMR成功`,
        //   duration: 500,
        // });
        GeneralModal.alert({
          content: language.success,
        });
      } else {
        GeneralModal.alert({
          title: language.failure,
          content: language.failure,
        });
      }
      setMMR_APPROVEMENT(userStore.MMR_APPROVEMENT);
    }
  }
  // async function toApproveGUILDTOKEN() {
  //   const result = await userStore.toApprove("GUILDTOKEN");
  //   console.log("授权结果====》", result);
  //   if (result) {
  //     const { approvement, status } = result;
  //     if (status) {
  //       Toast.show({
  //         icon: "success",
  //         content: `授权公会令牌成功`,
  //         duration: 500,
  //       });
  //     }
  //     console.log("userStore.GUILDTOKEN_APPROVEMENT", userStore.GUILDTOKEN_APPROVEMENT);
  //     setGUILDTOKEN_APPROVEMENT(userStore.GUILDTOKEN_APPROVEMENT);
  //   }
  // }
  async function confirmHandle() {
    // console.log("MMR余额", userStore.MMR);
    // console.log("EOCC余额", userStore.GOLD);
    // console.log("令牌余额", userStore.GUILDTOKEN);
    // console.log("MMR授权额度", userStore.MMR_APPROVEMENT);
    if (
      MMR_APPROVEMENT < 100000
      // || GUILDTOKEN_APPROVEMENT < 1
    ) {
      setShowModal("toProve");
      return;
    }
    if (
      userStore.MMR < 100000 ||
      userStore.GOLD < 1000000 ||
      userStore.GUILDTOKEN < 1
    ) {
      GeneralModal.alert({
        title: language.failure,
        confirmText: language.OK,
        content: (
          <div>
            <p>
              {language.MMR_balance}：{userStore.MMR}
            </p>
            <p>
              {language.EOCC_balance}：{userStore.GOLD}
            </p>
            <p>
              {language.TOKEN_balance}：{userStore.GUILDTOKEN}
            </p>
          </div>
        ),
      });
      return;
    }
    const result = await userStore.unionStore.CreateGuild();
    if (result) {
      userStore.startInit();
      onCancel();
    } else {
      GeneralModal.alert({
        title: language.failure,
        content: language.failure,
        confirmText: language.OK,
      });
    }
  }
  function renderModal() {
    if (showModal === "toProve") {
      return (
        <Modal
          title={language.impower}
          content={
            <>
              <br />
              <p>{language.toImpower} MMR</p>
            </>
            // <div className={css.list}>
            //   <div className={css.line}>
            //     <p>请授权MMR</p>
            //     <Button
            //       size="small"
            //       disabled={MMR_APPROVEMENT >= 100000 && true}
            //       onClick={() => {
            //         toApproveMMR();
            //       }}
            //     >
            //       {MMR_APPROVEMENT >= 100000 ? "已授权" : "授权"}
            //     </Button>
            //   </div>
            //   <div className={css.line}>
            //     <p>请授权公会令牌</p>
            //     <Button
            //       size="small"
            //       disabled={GUILDTOKEN_APPROVEMENT >= 1 && true}
            //       onClick={() => {
            //         toApproveGUILDTOKEN();
            //       }}
            //     >
            //       {GUILDTOKEN_APPROVEMENT >= 1 ? "已授权" : "授权"}
            //     </Button>
            //   </div>
            // </div>
          }
          noInpower={true}
          // confirmText={"取消"}
          confirmText={language.impower}
          onConfirm={() => {
            // setShowModal("");
            toApproveMMR();
          }}
          closeModal={() => {
            setShowModal("");
          }}
        />
      );
    }
  }

  return (
    <GeneralModal
      title={language.Create_Guild}
      buttonSize=""
      {...reset}
      onCancel={onCancel}
      onConfirm={confirmHandle}
      confirmText={language.OK}
      cancelText={language.ancel}
    >
      <div className={css.tip}>
        <p>{language.Cost_to_create_guild}</p>
        <p style={{ color: "RGBA(152, 108, 50, 1)" }}>100,000 MMR</p>
        <p style={{ color: "RGBA(152, 108, 50, 1)" }}>1,000,000 EOCC</p>
        <p style={{ color: "RGBA(152, 108, 50, 1)" }}>{language.Guild_Token}x1</p>
        {/* <p>请先进行授权操作</p> */}
      </div>
      {renderModal()}
    </GeneralModal>
  );
}

export default inject(
  "chain",
  "userStore",
  "languageStore"
)(observer(UnionCreate));
