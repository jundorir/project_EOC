import css from "./index.module.less";
import BaseModal from "../BaseModal";
import Button from "@components/Button";
import classNames from "classnames";
import { useState } from "react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import GeneralModal from "../GeneralModal";

function ChooseModal(props) {
  const {
    chain,
    userStore,
    way,
    ID,
    languageStore: { language },
  } = props;
  const { headStore } = userStore;
  const [isChoose, setIsChoose] = useState(ID);
  function renderIMG() {
    return headStore.data[way].map((item, index) => {
      return (
        <div
          className={classNames(
            css.imgbox,
            isChoose - index === 0 && css.choosed
          )}
          key={index}
        >
          <img
            className={css.img}
            src={item}
            onClick={(e) => {
              e.stopPropagation();
              setIsChoose(index);
            }}
            alt=""
          />
        </div>
      );
    });
  }
  async function modifyHead() {
    if (isChoose !== ID) {
      const result = await userStore.modifyInfo({
        user: chain.address,
        head: isChoose,
        sign: chain.token,
      });
      if (!result) {
        Toast.show({
          icon: "fail",
          content: language.net_wrang,
          duration: 500,
        });
        return;
      }
      if (result.code - 1 === 0) {
        userStore.init();
        props.closeModal();
        props.closeCal();
        GeneralModal.alert({
          content: language.success,
        });
        // Toast.show({
        //   icon: "success",
        //   content: "修改头像成功",
        //   duration: 500,
        // });
      } else {
        // Toast.show({
        //   icon: "fail",
        //   content: result.msg,
        //   duration: 500,
        // });
        GeneralModal.alert({
          title: language.failure,
          content: language.change_failure,
        });
      }
    }
  }
  async function modifyUnion() {
    headStore.changeUnionHead(isChoose);
    props.closeModal();
  }
  return (
    <div className={css.contain} onClick={props.closeModal}>
      <div
        className={css.containInner}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.box}>
          <div className={css.boxInner}>
            <div className={css.imgBox}>{renderIMG()}</div>
            <div className={css.button}>
              <Button
                children={language.ancel}
                onClick={(e) => {
                  e.stopPropagation();
                  props.closeModal();
                }}
              />
              <Button
                children={language.OK}
                onClick={(e) => {
                  e.stopPropagation();
                  way === "unionArray" && modifyUnion();
                  way === "headArray" && modifyHead();
                }}
                disabled={isChoose === ID}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "userStore",
  "chain",
  "languageStore"
)(observer(BaseModal(ChooseModal)));
