// 月卡会员
import css from "./index.module.less";
import { useState, Fragment } from "react";
import Button from "@components/Button";
import Modal from "@components/Modal/BuyModal";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import GeneralModal from "@components/Modal/GeneralModal";

function CardMember(props) {
  const { userStore } = props;
  const { MMR_APPROVEMENT, MMR } = userStore;
  const [showModal, setShowModal] = useState("");
  function tobuy() {
    console.log("购买");
  }

  async function toimpower() {
    const result = await userStore.toApprove("MMR");
    if (result?.status) {
      GeneralModal.alert({
        content: "授权成功",
      });
      userStore.queryAllowance("MMR");
    }
  }
  const needMMR = 20000;
  function renderModal() {
    if (showModal === "buy") {
      return (
        <Modal
          closeModal={() => {
            setShowModal("");
          }}
          title={"确认要购买月卡吗？"}
          confirmText={"确认"}
          impower={"授权"}
          comfimdisabled={MMR_APPROVEMENT - needMMR < 0 || MMR - needMMR < 0}
          impowerdisabled={MMR_APPROVEMENT - needMMR >= 0}
          content={
            <>
              <div className={css.top}>需消耗{needMMR}MMR</div>
              <div className={css.bottom}>请先进行授权操作</div>
            </>
          }
          onConfirm={() => {
            tobuy();
          }}
          onInpower={() => {
            toimpower();
          }}
        />
      );
    }
  }
  return (
    <Fragment>
      <div className={css.inner}>
        <div className={css.card}></div>
        <div>月卡会员福利</div>
        <div className={css.wordTwo}>每日免费高级盲盒x1</div>
        <div className={css.buy}>
          <Button
            className={css.button}
            children={"立即购买"}
            onClick={() => {
              setShowModal("buy");
            }}
          />
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("userStore")(observer(CardMember));
