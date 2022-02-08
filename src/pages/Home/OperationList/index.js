import { Fragment, useEffect, useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import Modal from "@components/Modal/ConfirmModal";
import classNames from "classnames";
import { Slider } from "antd-mobile";
import "./index.css";
import GeneralModal from "@components/Modal/GeneralModal";

function OperationList(props) {
  const { chain, view, audioStore, languageStore } = props;
  const [showModal, setShowModal] = useState(false);
  const language = { 0: "简体中文", 1: "繁體中文", 2: "English" };
  const idLanguge = { cn_simple: 0, cn_traditional: 1, en: 2 };
  const [languageID, setLanguageID] = useState(
    localStorage.getItem("language")
      ? idLanguge[JSON.parse(localStorage.getItem("language"))]
      : 2
  );
  function changelanguage(turn) {
    if (turn === "left") {
      const newID = languageID - 1;
      // newID < 0 ? setLanguageID(2) : setLanguageID(newID);
      if (newID < 0) {
        setLanguageID(2);
        languageStore.changeLanguage(2);
      } else {
        setLanguageID(newID);
        languageStore.changeLanguage(newID);
      }
    } else if (turn === "right") {
      const newID = languageID - 0 + 1;
      // newID > 2 ? setLanguageID(0) : setLanguageID(newID);
      if (newID > 2) {
        setLanguageID(0);
        languageStore.changeLanguage(0);
      } else {
        setLanguageID(newID);
        languageStore.changeLanguage(newID);
      }
    }
  }
  // const [num, setNum] = useState(audioStore.voice);
  const toastValue = (value) => {
    audioStore.changeVoice(value);
  };
  function renderModal() {
    if (showModal) {
      return (
        <Modal
          closeModal={() => {
            setShowModal(false);
          }}
          title={languageStore.language.Set_up}
          content={
            <>
              <div className={classNames(css.caption, css.top)}>
                {languageStore.language.lang}：
              </div>
              <div className={css.changelanguage}>
                <div
                  className={css.turnLeft}
                  onClick={() => {
                    changelanguage("left");
                  }}
                ></div>
                <div className={css.turnWord}>{language[languageID]}</div>
                <div
                  className={css.turnRight}
                  onClick={() => {
                    changelanguage("right");
                  }}
                ></div>
              </div>
              <div className={classNames(css.caption)}>
                {languageStore.language.Volume}：
              </div>
              <div className={css.changevolume} id="mask">
                {/* <div className={css.button}></div> */}
                <Slider
                  defaultValue={audioStore.voice}
                  onChange={toastValue}
                  className="setting_slider"
                />
                <div className={css.precentBox}>
                  <div
                    className={css.precent}
                    style={{ left: `${audioStore.voice}%` }}
                  >
                    {audioStore.voice}%
                  </div>
                </div>
              </div>
            </>
          }
          isShow={false}
          isShowButton={false}
        />
      );
    }
  }
  return (
    <Fragment>
      <div className={css.operationList}>
        <div
          className={css.store}
          onClick={() => {
            GeneralModal.alert({
              title: languageStore.language.coming_soon,
              content: languageStore.language.feature_coming_soon,
              confirmText: languageStore.language.OK,
            });
            // view.changeDisplayView("cardMember");
          }}
        >
          <div className={css.storeIMG}></div>
          <div className={css.storeWord}>{languageStore.language.Member}</div>
        </div>
        {/* <div
          className={css.activity}
          onClick={() => {
            console.log("活动");
          }}
        >
          <div className={css.activityIMG}></div>
          <div className={css.word}>活动</div>
        </div> */}
        <div
          className={css.invitation}
          onClick={() => {
            GeneralModal.alert({
              title: languageStore.language.coming_soon,
              content: languageStore.language.feature_coming_soon,
              confirmText: languageStore.language.OK,
            });
            // view.changeDisplayView("invitation");
          }}
        >
          <div className={css.invitationIMG}></div>
          <div className={css.word}>{languageStore.language.Invite}</div>
        </div>
        <div
          className={css.setting}
          onClick={() => {
            setShowModal(true);
          }}
        >
          <div className={css.settingIMG}></div>
          <div className={css.word}>{languageStore.language.Set_up}</div>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject(
  "chain",
  "view",
  "audioStore",
  "languageStore"
)(observer(OperationList));
