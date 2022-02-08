// 首页
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import copy from "copy-to-clipboard";

import AuthorizeModal from "@components/Modal/HeroModal/AuthorizeModal";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import WrappedHeroCard from "@components/Card/HeroCard";
import Seperate from "@components/Seperate";
import CopyBtn from "@assets/images/market/copy_btn.png";

import Button from "@components/Button";

import css from "./index.module.less";
import { Toast } from "antd-mobile";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const SaleDetail = (props) => {
  const { view, userStore, languageStore } = props;

  const { marketStore } = userStore;
  const { saleHero } = marketStore;
  const { language } = languageStore;

  const [showModal, setShowModal] = useState(null);
  const symbol = saleHero.symbol === "EOCC" ? "GOLD" : saleHero.symbol;

  const isEnoughCost = userStore[symbol] - saleHero.price >= 0;
  //复制
  const handleCopy = (value) => {
    if (copy(value)) {
      setShowModal("confirmCopy");
    } else {
      Toast.show({
        icon: "fail",
        content: "复制错误",
        duration: 1000,
      });
    }
  };
  async function toApprove() {
    try {
      const result = await marketStore.toApprove(symbol);
      if (result) {
        //TODO：购买逻辑链条
      }
    } catch {}
  }

  async function toSubmit() {
    try {
      const result = await marketStore.buyHero(saleHero.hero.tokenId);
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
        marketStore[`${symbol}_APPROVEMENT`] - saleHero.price >= 0;

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
              <p>{language.Do_you_decided_purchase_this_hero}</p>
              <p>{language.Please_Authorize_first}</p>
            </div>
          </div>
        </AuthorizeModal>
      );
    }
    if (showModal === "confirmCopy") {
      return (
        <MessageModal
          title="复制成功"
          closeModal={() => {
            setShowModal(null);
          }}
        >
          <div className={css.copy_content}>
            <div>
              <p className={css.title}>地址</p>
              <p className={css.addr}>{saleHero.origin_seller}</p>
            </div>
          </div>
        </MessageModal>
      );
    }

    return null;
  }

  return (
    <div className={css.SaleDetail}>
      <div className={css.ContentBox}>
        <div className={css.CardBox}>
          <WrappedHeroCard
            hero={saleHero.hero}
            style={{
              transform: "scale(.75)",
              transformOrigin: "left top",
            }}
          />
        </div>
        <div className={css.DetailContent}>
          <p>
            <span>
              <Seperate>{language.number}</Seperate>
            </span>
            <span>:</span>
            <span>{saleHero.id}</span>
          </p>

          <p>
            <span>
              <Seperate>{language.price}</Seperate>
            </span>
            <span>:</span>
            <span>
              {saleHero.symbol === "EOCC"
                ? Math.ceil(Number(saleHero.price))
                : Number(saleHero.price).toFixed(4)}
            </span>
            <span className={css.unit}>{saleHero.symbol}</span>
          </p>
          {/* <p className={css.almost_price}>≈$1,020.12</p> */}

          <p
            onClick={() => {
              handleCopy(saleHero.origin_seller);
            }}
          >
            <span>
              <Seperate>{language.seller}</Seperate>
            </span>
            <span>:</span>
            <span>{saleHero.seller}</span>
            <img src={CopyBtn} className={css.CopyBtn} />
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
