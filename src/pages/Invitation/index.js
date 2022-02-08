import React, { useState } from "react";
import QRCode from "qrcode.react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
// import classNames from "classnames";
import css from "./index.module.less";
import BottomPlaceholder from "@components/BottomPlaceholder";
import Button from "@components/Button";
import InvitationModal from "./InvitationModal";

function Invitation(props) {
  const { chain } = props;
  const [showModal, stShowModal] = useState("");
  const inventerUser = chain.address
    ? `?sharer=${chain.address}`
    : `${chain.address}`;
  const address = `https://${window.location.host}/` + inventerUser;
  const copyWord = React.useCallback(() => {
    if (chain.address !== "") {
      // console.log(123);
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_input");
      tag.value = address;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_input").select();
      document.execCommand("copy");
      document.getElementById("cp_input").remove();
      console.log("复制成功");
      Toast.show({
        icon: "success",
        content: `复制成功`,
        duration: 1000,
      });
    } else {
      Toast.show({
        icon: "fail",
        content: `地址错误`,
        duration: 1000,
      });
    }
  }, [address]);
  const datas = [
    { id: 1, title: "我获得的奖励", number: 0 },
    { id: 2, title: "待领取", number: 0 },
    { id: 3, title: "我邀请的好友   ", number: 0 },
  ];
  function renderInfo() {
    return datas.map((item) => {
      return (
        <div className={css.data} key={item.id}>
          <div className={css.left}>
            <span className={css.white}>{item.title}</span>
            <span className={css.yellow}>{item.id === 2 && item.number}</span>
          </div>
          {item.id === 2 ? (
            // <div
            //   className={css.getbutton}
            //   onClick={() => {
            //     console.log("领取");
            //   }}
            //   disabled={true}
            // >
            //   领取
            // </div>
            <Button
              size="middle"
              className={css.getbutton}
              onClick={() => {
                console.log("领取");
              }}
              disabled={true}
            >
              领取
            </Button>
          ) : (
            <div className={css.right}>
              {item.number}
              {item.id === 3 && "位"}
            </div>
          )}
        </div>
      );
    });
  }
  function renderModal() {
    if (showModal === "Invited") {
      return (
        <InvitationModal
          closeModal={() => {
            stShowModal("");
          }}
          title={"邀请记录"}
          id={1}
        />
      );
    } else if (showModal === "reward") {
      return (
        <InvitationModal
          closeModal={() => {
            stShowModal("");
          }}
          title={"奖励记录"}
          id={2}
        />
      );
    }
  }
  return (
    <div className={css.containBox}>
      <div className={css.header}>
        <div className={css.title}>邀请好友</div>
        <div>获得持续EOCC奖励</div>
        <div>邀请人获得被邀请人产出EOCC的10%奖励</div>
        <div>奖励由推广基金提供</div>
        <div className={css.QRCode}>
          <div className={css.QRCodeInner}>
            <QRCode value={address} className={css.qr} />
          </div>
        </div>
      </div>
      <div className={css.body}>
        <div className={css.copy}>
          <div className={css.link}>{address}</div>
          {/* <div className={css.copybutton} onClick={() => copyWord()}>
            复制
          </div> */}
          <Button
            className={css.copybutton}
            size="middle"
            onClick={() => copyWord()}
          >
            复制
          </Button>
        </div>
        <div className={css.info}>{renderInfo()}</div>
      </div>
      <div className={css.bottom}>
        <Button
          className={css.buttton}
          children={"邀请记录"}
          onClick={() => {
            stShowModal("Invited");
          }}
          disabled={true}
        />
        <Button
          children={"奖励记录"}
          onClick={() => {
            stShowModal("reward");
          }}
          disabled={true}
        />
      </div>
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
}

export default inject("chain")(observer(Invitation));
