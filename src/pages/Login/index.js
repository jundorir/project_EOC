// 登录页面
import React, { useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import "./index.css";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import OperationConfirmModal from "@components/Modal/HeroModal/OperationConfirmModal";

function Login(props) {
  const {
    chain,
    languageStore: { language },
  } = props;
  const [showModal, setShowModal] = useState(false);
  function login() {
    if (chain.address === "") {
      chain.login();
    }
  }

  async function startGame() {
    Toast.show({
      icon: "loading",
      content: ``,
      duration: 0,
      maskClassName: "loading_toast",
    });
    try {
      const token = chain.checkToken();
      if (!token) {
        const result = await chain.requestToken();
        if (!!result) {
          Toast.clear();
        }
      } else {
        Toast.clear();
      }
    } catch {
      Toast.clear();
    }
  }

  function renderModal() {
    if (showModal) {
      return (
        <OperationConfirmModal
          onSubmit={() => {
            startGame();
          }}
          closeModal={() => {
            setShowModal(false);
          }}
          title={language.tip}
          submitText={language.login}
        >
          <div className={css.content}>
            <div className={css.tips1}>{language.loginTips1}</div>
            <div className={css.tips2}>{language.loginTips2}</div>
          </div>
        </OperationConfirmModal>
      );
    }
    return null;
  }

  return (
    <div
      className={css.login}
      onClick={() => {
        if (!chain.address) {
          return;
        }
        setShowModal(true);
      }}
    >
      <div className={css.loginWord}></div>
      {chain.address ? (
        <div className={css.begin}>{language.startGame}</div>
      ) : (
        <div
          className={css.loginConnect}
          onClick={() => {
            login();
          }}
        >
          Connect
        </div>
      )}
      {renderModal()}
    </div>
  );
}

export default inject(
  "chain",
  "view",
  "userStore",
  "languageStore"
)(observer(Login));
