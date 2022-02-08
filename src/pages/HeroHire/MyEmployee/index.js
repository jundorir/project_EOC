// 首页
import { useState } from "react";
import { inject, observer } from "mobx-react";
import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import HeroSelector from "@components/HeroSelector";
import Seperate from "@components/Seperate";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const MyEmployee = (props) => {
  const { view } = props;

  const heroList = [
    {
      id: "1",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "2",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "3",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "4",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "5",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "6",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
  ];
  const [rare, setRare] = useState("ALL");
  const [order, setOrder] = useState("rarity");

  return (
    <div className={css.MyEmployee}>
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
                view.changeDisplayView("employeerDetail");
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
                <span>{item.promiseGold}EOCC</span>
              </p>
              <p>
                <span>
                  <Seperate>保证金</Seperate>
                </span>
                <span>:</span>
                <span>{item.sure}USDT</span>
              </p>
              <p>
                <span>
                  <Seperate>剩余时间</Seperate>
                </span>
                <span>:</span>
                <span>{item.restTime}</span>
              </p>
              <p>
                <span>
                  <Seperate>已产出</Seperate>
                </span>
                <span>:</span>
                <span>{item.productGold}EOCC</span>
              </p>
            </div>
          );
        })}
      </div>
      <BottomPlaceholder />
    </div>
  );
};

export default inject("view")(observer(MyEmployee));
