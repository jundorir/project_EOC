// 战役
import { Fragment, useEffect, useState } from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import { RewardIcon } from "../List";
import GeneralModal from "@components/Modal/GeneralModal";
import { inject, observer } from "mobx-react";
function Modal(props) {
  const {
    visible,
    setVisible,
    heroPower,
    view,
    languageStore: { language },
  } = props;
  if (!visible) {
    return null;
  }
  let config = {
    title: language.Unable_Attack,
    content: (
      <Fragment>
        <div className={css.text1}>
          {language.Unable_Attack_Tips1}
          <br /> {language.Unable_Attack_Tips2}
        </div>
        <div className={css.text2}>
          {language.Unable_Attack_Tips3}
          <br /> {language.Unable_Attack_Tips4}
        </div>
      </Fragment>
    ),
    confirmText: language.OK,
  };
  if (heroPower === 0) {
    config = {
      title: language.noHero,
      content: (
        <Fragment>
          <div className={css.text3}>{language.noHero_Tips1}</div>
        </Fragment>
      ),
      confirmText: language.goFormation, // languageStore.language
    };
  }
  function toPage() {
    view.changeDisplayView("battleFormation");
  }
  return (
    <Fragment>
      <GeneralModal
        visible={visible}
        title={config.title}
        onConfirm={() => {
          heroPower === 0 ? toPage() : setVisible(false);
        }}
        confirmText={config.confirmText}
        showCancel={false}
        buttonSize={""}
      >
        <div className={css.content}>{config.content}</div>
      </GeneralModal>
    </Fragment>
  );
}
export default inject("view", "languageStore")(observer(Modal));
