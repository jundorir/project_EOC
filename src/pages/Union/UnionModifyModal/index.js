import Button from "@components/Button";
import React, { useState, useRef, useEffect, Fragment } from "react";
import Notify from "../Notify";
import UnionLogan from "../UnionLogan";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import union from "src/store/subStore/union";
import GeneralModal from "@components/Modal/GeneralModal";
import { Toast } from "antd-mobile";
import ChooseModal from "@components/Modal/ChooseModal";
import classNames from "classnames";

// 入会制度
// const systemMap = {
//   1: "公开加入",
//   2: "邀请制",
// };

function UnionModifyModal(props) {
  const {
    userStore,
    chain,
    languageStore: { language },
  } = props;
  const { unionStore, headStore } = userStore;
  const { unionInfo } = unionStore;
  const [formData, setFormData] = useState({
    avatar_image: unionInfo.avatar_image,
    name: unionInfo.name,
    notice: unionInfo.notice,
    invite_method: unionInfo.invite_method,
    min_bp: unionInfo.min_bp,
    guild_id: unionInfo.guild_id,
  });
  const [choose, setChoose] = useState("");
  // 修改入会制度
  function systemHandle() {
    // console.log("改入会制度");
    setFormData({
      ...formData,
      invite_method: formData.invite_method === "1" ? "2" : "1",
    });
  }
  // 修改最小申请条件
  function bpHandle(isReduce = false) {
    let newBp = formData.min_bp;
    isReduce ? (newBp -= 1) : (newBp += 1);
    newBp <= 0 && (newBp = 0);
    setFormData({
      ...formData,
      min_bp: newBp,
    });
  }
  // 修改最小申请条件
  function inputBpHandle(value) {
    setFormData({
      ...formData,
      min_bp: value,
    });
  }
  // 修改名称输入框
  function changeHandle({ target, target: { name, value } }) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  //确定修改
  async function toModify() {
     const result = await unionStore.queryUpGuildInfo({
      user: chain.address,
      guild_id: formData.guild_id,
      name: formData.name,
      // invite_method: formData.invite_method,
      invite_method: 2,
      avatar_image:
        headStore.unionHead !== -1
          ? headStore.unionHead
          : formData.avatar_image,
      min_bp: formData.min_bp === "" ? 0 : formData.min_bp,
      notice: formData.notice,
      sign: chain.token,
    });
    if (result?.code) {
      unionStore.queryGetGuildInfo({
        user: chain.address,
        guild_id: userStore.guild_id,
        sign: chain.token,
      });
      GeneralModal.alert({
        content: language.success,
        onConfirm: () => {
          props.onClose();
          headStore.changeUnionHead(-1);
        },
      });
    } else {
      GeneralModal.alert({
        title: language.failure,
        content: language.cannotempty,
      });
    }
  }
  function chooseHead() {
    setChoose("union");
  }
  function renderModal() {
    if (choose === "union") {
      return (
        <ChooseModal
          way="unionArray"
          ID={formData.avatar_image}
          closeModal={() => {
            setChoose("");
          }}
        />
      );
    }
  }
  return (
    <Fragment>
      <div
        className={css.mask}
        onClick={() => {
          props.onClose();
        }}
      >
        <div
          className={css.body}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h6 className={css.title}>{language.Information_Changes}</h6>
          <div className={css.header}>
            <UnionLogan
              onClick={() => {
                chooseHead();
              }}
              showModify
              url={
                headStore.data.unionArray[
                  headStore.unionHead !== -1
                    ? headStore.unionHead
                    : formData.avatar_image
                ]
              }
            />
            <div className={css.aside}>
              <p>{language.name_change}：</p>
              <div className={css.name}>
                <input
                  placeholder={language.input_name}
                  autoComplete="off"
                  name="name"
                  onChange={changeHandle}
                  value={formData.name}
                  type="text"
                  maxLength={10}
                />
                {/* <Button onClick={handleSaveName} size="middle">
                  更改名称
                </Button> */}
              </div>
              {/* <p className={css.tip}>
                修改名称消耗 <span> 10000MMR</span>
              </p> */}
            </div>
          </div>
          <Notify
            name="notice"
            onChange={changeHandle}
            editable
            grey
            placeholder={language.input_notice}
            style={{ marginTop: "35px" }}
            content={formData.notice}
          />
          <div className={css.form_item}>
            <div className={css.form_item_name}>
              {language.membership_system}：
            </div>
            <div className={classNames(css.switch, css.system)}>
              {/* <button
                onClick={systemHandle}
                className={css.switch_left}
              ></button> */}
              <div className={css.switch_value}>
                {/* {systemMap[formData.invite_method]} */}
                {/* {systemMap[2]} */}
                {language.Invitation}
              </div>
              {/* <button
                onClick={systemHandle}
                className={css.switch_right}
              ></button> */}
            </div>
          </div>
          {/* <div className={css.form_item}>
            <div className={css.form_item_name}>最小申请条件：</div>
            <div className={css.switch}>
              <button
                onClick={() => bpHandle(true)}
                className={css.switch_left}
              ></button>
              <div className={css.switch_value}>
                power
                <input
                  className={css.powerInput}
                  type="number"
                  value={formData.min_bp}
                  onChange={(e) => {
                    inputBpHandle(e.target.value);
                  }}
                />
              </div>
              <button
                onClick={() => bpHandle()}
                className={css.switch_right}
              ></button>
            </div>
          </div> */}
          <div className={css.actions}>
            <Button
              onClick={() => {
                headStore.changeUnionHead(-1);
                props.onClose();
              }}
            >
              {language.ancel}
            </Button>
            <Button
              onClick={() => {
                toModify();
              }}
            >
              {language.OK}
            </Button>
          </div>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}
export default inject(
  "userStore",
  "chain",
  "languageStore"
)(observer(UnionModifyModal));
