// 首页
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";

import AuthorizeModal from "@components/Modal/HeroModal/AuthorizeModal";
import PropsCard from "@components/Card/PropsCard";

import Seperate from "@components/Seperate";

import Button from "@components/Button";

import css from "./index.module.less";
import { Toast } from "antd-mobile";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const SaleDetail = (props) => {
  const { view, userStore, languageStore } = props;

  const { marketStore } = userStore;
  const { saleMaterial } = marketStore;
  const { language } = languageStore;

  const [showModal, setShowModal] = useState(null);
  const symbol = saleMaterial.symbol === "EOCC" ? "GOLD" : saleMaterial.symbol;

  const isEnoughCost = userStore[symbol] - saleMaterial.price >= 0;

  async function toApprove() {
    try {
      const result = await marketStore.toApproveMaterialMarket(symbol);
      if (result) {
        //TODO：购买逻辑链条
      }
    } catch {}
  }

  async function toSubmit() {
    try {
      const result = await marketStore.buyMaterial(
        saleMaterial.order_id,
        saleMaterial.materialKey
      );
      // console.log("result ===> ", result);

      if (result) {
        Toast.show({
          icon: "success",
          content: language.Purchase_success,
        });
        setShowModal(null);
        view.goBack();
        return;
      }
    } catch {}
    Toast.show({
      icon: "fail",
      content: language.Purchase_fail,
    });
  }

  function renderModal() {
    if (showModal === "confirmBuy") {
      const isApprove =
        marketStore[`${symbol}_MaterialMarket_APPROVEMENT`] -
          saleMaterial.price >=
        0;

      return (
        <AuthorizeModal
          toApprove={toApprove}
          isApprove={isApprove}
          toSubmit={toSubmit}
          title={language.Purchase}
          closeModal={() => {
            setShowModal(null);
          }}
        >
          <div className={css.content}>
            <div>
              <p>{language.Confirm_buy_prop}</p>
              <p>{language.Please_Authorize_first}</p>
            </div>
          </div>
        </AuthorizeModal>
      );
    }

    return null;
  }

  return (
    <div className={css.SaleDetail}>
      <div className={css.ContentBox}>
        <div className={css.CardBox}>
          <PropsCard size="l" materialKey={saleMaterial.materialKey} />
        </div>
        <div className={css.DetailContent}>
          <p>
            <span>
              <Seperate>{language.number}</Seperate>
            </span>
            <span>:</span>
            <span>{saleMaterial.id}</span>
          </p>
          <p>
            <span>
              <Seperate>{language.amount}</Seperate>
            </span>
            <span>:</span>
            <span>{saleMaterial.materialNumber}</span>
          </p>
          <p>
            <span>
              <Seperate>{language.price}</Seperate>
            </span>
            <span>:</span>
            <span>
              {saleMaterial.symbol === "EOCC"
                ? Math.ceil(Number(saleMaterial.price))
                : Number(saleMaterial.price).toFixed(4)}
            </span>
            <span className={css.unit}>{saleMaterial.symbol}</span>
          </p>
        </div>
      </div>
      <div className={css.DetailFooter}>
        <Button
          onClick={() => {
            view.goBack();
          }}
        >
          {language.battle_cancel}
        </Button>
        <Button
          onClick={() => {
            setShowModal("confirmBuy");
          }}
          disabled={!isEnoughCost}
        >
          {language.Confirm_Purchase}
        </Button>
      </div>
      {renderModal()}
    </div>
  );
};

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(SaleDetail));
