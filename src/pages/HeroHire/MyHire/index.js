// 首页
import { useState } from "react";
import { inject, observer } from "mobx-react";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import HeroSelector from "@components/HeroSelector";
import SmallButton from "@components/SmallButton";
import Button from "@components/Button";
import Seperate from "@components/Seperate";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取
const HeroStatus = ({ status }) => {
  function StatusText(value) {
    switch (value) {
      case 1:
        return <span>雇佣中...</span>;
      case 2:
        return <span>待雇佣</span>;
      case 3:
        return <span>待领取</span>;
      default:
        return (
          <span style={{ color: "rgba(255, 255, 255, .5)" }}>雇佣结束</span>
        );
    }
  }
  return (
    <div className={css.HeroStatus}>
      {StatusText(status)}
      {status === 2 ? (
        <SmallButton>撤回</SmallButton>
      ) : status === 3 ? (
        <SmallButton>领取</SmallButton>
      ) : (
        <></>
      )}
    </div>
  );
};
const MyHire = (props) => {
  const [heroModal, setHeroModal] = useState(null);

  const oneKeyGetInfo = {
    getHeroList: [
      {
        id: "1",
        rare: "N",
        star: 1,
        name: "弓兵",
        level: 10,
      },
      {
        id: "2",
        rare: "N",
        star: 1,
        name: "弓兵",
        level: 10,
      },
      {
        id: "3",
        rare: "N",
        star: 1,
        name: "弓兵",
        level: 10,
      },
      {
        id: "4",
        rare: "N",
        star: 1,
        name: "弓兵",
        level: 10,
      },
    ],
    gold: 10000,
    USDT: 1000.232442,
  };
  function renderModal() {
    if (heroModal === "oneKey") {
      return (
        <MessageModal
          closeModal={() => {
            setHeroModal(null);
          }}
          title="一键领取成功"
        >
          <div className={css.content}>
            <div>
              <p>英雄</p>
              {oneKeyGetInfo.getHeroList.map((item) => {
                return (
                  <p id={item.id}>
                    <span>{item.rare}</span>
                    <span>{item.star}星</span>
                    <span>{item.name}</span>
                    <span>{item.level}级</span>
                  </p>
                );
              })}
            </div>
            <div>
              <p>材料</p>
              <p>{oneKeyGetInfo.gold}</p>
            </div>
            <div>
              <p>USDT</p>
              <p>{oneKeyGetInfo.USDT}</p>
            </div>
          </div>
        </MessageModal>
      );
    }

    return null;
  }
  const { view } = props;
  const heroList = [
    { id: "1", promiseGold: 2000, sure: 2000, status: 0, hero: {} },
    { id: "2", promiseGold: 2000, sure: 2000, status: 1, hero: {} },
    { id: "3", promiseGold: 2000, sure: 2000, status: 2, hero: {} },
    { id: "4", promiseGold: 2000, sure: 2000, status: 3, hero: {} },
    { id: "5", promiseGold: 2000, sure: 2000, status: 0, hero: {} },
    { id: "6", promiseGold: 2000, sure: 2000, status: 1, hero: {} },
    { id: "7", promiseGold: 2000, sure: 2000, status: 0, hero: {} },
  ];
  const [rare, setRare] = useState("ALL");
  const [order, setOrder] = useState("rarity");

  return (
    <div className={css.MyHire}>
      <div className={css.SelectorArea}>
        <HeroSelector rare={rare} setRare={setRare} setOrder={setOrder} />
      </div>
      <div className={css.HeroArea}>
        {heroList.map((item) => {
          return (
            <div
              key={item.id}
              className={css.HeroBox}
              onClick={() => {
                view.changeDisplayView("myHireDetail");
              }}
            >
              <div className={css.CardBox}>
                <WrappedHeroCard
                  hero={item.hero}
                  style={{
                    transform: "scale(.346)",
                    transformOrigin: "left top",
                  }}
                />
              </div>
              <HeroStatus status={item.status} />
              <p>
                <span>
                  <Seperate>需保证产量</Seperate>
                </span>
                <span>:</span>
                <span>{item.promiseGold}EOCC</span>
              </p>
              <p>
                <span>
                  <Seperate>保证金</Seperate>
                </span>
                <span>:</span>
                <span>{item.sure}USDT</span>
              </p>
            </div>
          );
        })}
      </div>
      <div
        className={css.oneButton}
        onClick={() => {
          setHeroModal("oneKey");
        }}
      >
        <Button>一键领取</Button>
      </div>
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
};

export default inject("view")(observer(MyHire));
