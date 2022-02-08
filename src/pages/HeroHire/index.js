// 首页
import { useState } from "react";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import HeroSelector from "@components/HeroSelector";
import Button from "@components/Button";
import Seperate from "@components/Seperate";

import css from "./index.module.less";
const numberTrans = (number) => {
  if (number < 1000) {
    return number;
  }
  if (number < 1000000) {
    return (number / 1000).toFixed(2) + "K";
  }
  if (number < 1000000000) {
    return (number / 1000000).toFixed(2) + "M";
  }
  return (number / 1000000000).toFixed(2) + "B";
};
const HireMarket = (props) => {
  const { view } = props;

  const myHero = {
    hireNum: 5,
    employee: 6,
  };
  const heroList = [
    {
      id: "1",
      promiseGold: 200000,
      sure: 2000,
      hero: {},
    },
    { id: "2", promiseGold: 2000, sure: 2000, hero: {} },
    { id: "3", promiseGold: 2000, sure: 2000, hero: {} },
    { id: "4", promiseGold: 2000, sure: 2000, hero: {} },
    { id: "5", promiseGold: 2000, sure: 2000, hero: {} },
    { id: "6", promiseGold: 2000, sure: 2000, hero: {} },
    { id: "7", promiseGold: 2000, sure: 2000, hero: {} },
  ];
  const [rare, setRare] = useState("ALL");
  const [order, setOrder] = useState("rarity");

  return (
    <div className={css.HireMarket}>
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
                view.changeDisplayView("hireDetail");
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
              <p>
                <span>
                  <Seperate>需保证产量</Seperate>
                </span>
                <span>:</span>
                <span>{numberTrans(item.promiseGold)}EOCC</span>
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
        <div className={css.SwitchBtns}>
          <Button
            onClick={() => {
              view.changeDisplayView("hire");
            }}
          >
            出租英雄
          </Button>
          <Button
            onClick={() => {
              view.changeDisplayView("myHire");
            }}
          >
            我的出租({myHero.hireNum})
          </Button>
          <Button
            onClick={() => {
              view.changeDisplayView("myEmployee");
            }}
          >
            我的雇佣({myHero.employee})
          </Button>
        </div>
      </div>
      <BottomPlaceholder />
    </div>
  );
};

export default inject("view")(observer(HireMarket));
