// 首页
import { useState } from "react";
import { inject, observer } from "mobx-react";

import AuthorizeModal from "@components/Modal/HeroModal/AuthorizeModal";
import WrappedHeroCard from "@components/Card/HeroCard";
import Seperate from "@components/Seperate";

import Button from "@components/Button";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const HireDetail = (props) => {
  const heroDetail = {
    id: "1",
    // productGold: 2000,
    sure: 2000,
    hireTime: 24,
    promiseGold: 2000,
    hero: {},
  };
  const { view } = props;

  const [heroModal, setHeroModal] = useState(null);
  function renderModal() {
    if (heroModal === "confirmEmp") {
      return (
        <AuthorizeModal
          toApprove={() => {
            setHeroModal(null);
            view.goBack();
          }}
          title="雇佣"
        >
          <div className={css.content}>
            <div>
              <p>确认要雇佣此英雄24小时吗？</p>
              <p>请先进行授权操作</p>
            </div>
            <div className={css.tips}>
              <p>需支付保证金100USDT，</p>
              <p>退还时将退回保证金的70%</p>
              <p>若未达到保证产量，保证金不予退还</p>
            </div>
          </div>
        </AuthorizeModal>
      );
    }

    return null;
  }
  return (
    <div className={css.HireDetail}>
      <div className={css.ContentBox}>
        <div className={css.CardBox}>
          <WrappedHeroCard
            hero={heroDetail.hero}
            style={{
              transform: "scale(.75)",
              transformOrigin: "left top",
            }}
          />
        </div>
        <div className={css.DetailContent}>
          <p>
            <span>
              <Seperate>需保证产量</Seperate>
            </span>
            <span>:</span>
            <span>{heroDetail.promiseGold}EOCC</span>
          </p>
          <p>
            <span>
              <Seperate>保证金</Seperate>
            </span>
            <span>:</span>
            <span>{heroDetail.sure}USDT</span>
          </p>
          <p>
            <span>
              <Seperate>雇佣时长</Seperate>
            </span>
            <span>:</span>
            <span>{heroDetail.hireTime}小时</span>
          </p>
          {/* <p>
                <span>
                  <Seperate>已产出</Seperate>
                </span>
                <span>:</span>
                <span>{heroDetail.productGold}EOCC</span>
      </p> */}
        </div>
      </div>
      <div className={css.DetailFooter}>
        <Button
          onClick={() => {
            view.goBack();
          }}
        >
          取消
        </Button>
        <Button
          onClick={() => {
            setHeroModal("confirmEmp");
          }}
        >
          确认雇佣
        </Button>
      </div>
      {renderModal()}
    </div>
  );
};

export default inject("view")(observer(HireDetail));
