// 首页
import { useState, useRef, useEffect } from "react";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import Seperate from "@components/Seperate";
import { sec_to_time } from "@utils/common";
import Button from "@components/Button";

import css from "./index.module.less";
const heroDetail = {
  id: "1",
  promiseGold: 2000,
  sure: 2000,
  status: 3, //status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取
  hero: {},
  deadline: Date.now() + 12000,
};
const MyHireDetail = (props) => {
  const { view } = props;
  const [heroModal, setHeroModal] = useState(null);
  function renderModal() {
    if (heroModal === "get") {
      return (
        <MessageModal
          closeModal={() => {
            setHeroModal(null);
            view.goBack();
          }}
          title="领取成功"
          confirmText="完成"
        >
          <div className={css.content}>
            <p>
              <span>英雄</span>
              <span>:</span>
              <span>腓特烈</span>
            </p>
            <p>
              <span>EOCC</span>
              <span>:</span>
              <span>10000</span>
            </p>
            <p>
              <span>USDT</span>
              <span>:</span>
              <span>2.536</span>
            </p>
          </div>
        </MessageModal>
      );
    }

    if (heroModal === "wait") {
      return (
        <MessageModal
          closeModal={() => {
            setHeroModal(null);
            view.goBack();
          }}
          title="撤回成功"
          confirmText="完成"
        >
          <div className={css.content}>
            <p>
              <span>英雄</span>
              <span>:</span>
              <span>腓特烈</span>
            </p>
            <p>
              <span>EOCC</span>
              <span>:</span>
              <span>10000</span>
            </p>
            <p>
              <span>USDT</span>
              <span>:</span>
              <span>2.536</span>
            </p>
          </div>
        </MessageModal>
      );
    }

    return null;
  }
  function StatusText(value) {
    switch (value) {
      case 1:
        return <span>雇佣中...</span>;
      case 2:
        return <span>待雇佣</span>;
      case 3:
        return <span>待领取</span>;
      default:
        return <span>雇佣结束</span>;
    }
  }
  const [heroStatus, setHeroStatus] = useState(heroDetail.status);

  const intervalRef = useRef(null);
  const [rest, setRest] = useState(1);

  useEffect(() => {
    if (heroDetail.deadline - Date.now() <= 0) {
      setHeroStatus(0);
      return null;
    }
    computeDate();
    intervalRef.current = setInterval(() => {
      computeDate();
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  function computeDate() {
    let date = Date.now();
    let diffTime = heroDetail.deadline - date;
    if (diffTime <= 0 && intervalRef.current) {
      setHeroStatus(3);
      clearInterval(intervalRef.current);
    }
    setRest(diffTime);
  }
  return (
    <div className={css.MyHireDetail}>
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
            <Seperate>当前状态</Seperate>
          </span>
          <span>:</span>
          {StatusText(heroStatus)}
        </p>
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
        {heroStatus !== 0 && heroStatus !== 3 && (
          <p>
            <span>
              <Seperate>剩余时长</Seperate>
            </span>
            <span>:</span>
            <span>{sec_to_time(rest)}</span>
          </p>
        )}
      </div>
      {heroStatus === 2 && (
        <div
          className={css.DetailFooter}
          onClick={() => {
            setHeroModal("wait");
          }}
        >
          <Button>撤回</Button>
        </div>
      )}
      {heroStatus === 3 && (
        <div
          className={css.DetailFooter}
          onClick={() => {
            setHeroModal("get");
          }}
        >
          <Button>领取</Button>
        </div>
      )}
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
};

export default inject("view")(observer(MyHireDetail));
