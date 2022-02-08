// 首页
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import PropsCard from "@components/Card/PropsCard";

import MarketSelector from "@components/MarketSelector";
import Button from "@components/Button";
import Seperate from "@components/Seperate";

import css from "./index.module.less";
import DropSelect from "@components/DropSelect";

const Market = (props) => {
  const {
    view,
    userStore,
    languageStore: { language },
  } = props;

  const {
    marketStore,
    marketStore: { saleList },
  } = userStore;
  const orderList = [
    //新增价格排序
    { text: language.Lowest_Price, value: "price_up" },
    { text: language.Highest_Price, value: "price_down" },
    { text: language.Lowest_Power, value: "power_up" },
    { text: language.Highest_Power, value: "power_down" },
  ];
  //选择道具时的排序
  const propsOrderList = [
    //新增价格排序
    { text: language.Lowest_Total_Price, value: "total_price_up" },
    { text: language.Highest_Total_Price, value: "total_price_down" },
    { text: language.Lowest_Single_Price, value: "price_up" },
    { text: language.Highest_Single_Price, value: "price_down" },
  ];

  useEffect(() => {
    marketStore.setViewer("mySale");
  }, []);
  useEffect(() => {
    if (marketStore.rare !== "Props") {
      marketStore.queryMyOnSaleHeroList();
    } else {
      marketStore.queryMyOnSaleMaterialList();
    }
  }, [marketStore]);

  const renderList = () => {
    if (marketStore.rare !== "Props") {
      return saleList.map((item, index) => {
        return index % 2 ? (
          <div key={item.id} className={css.HeroBox_container}>
            <div
              className={css.HeroBox}
              onClick={() => {
                view.changeDisplayView("mySaleDetail", item.id);
                marketStore.setSaleHero(item);
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
                  <Seperate>{language.number}</Seperate>
                </span>
                <span>:</span>
                <span>{item.id}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.price}</Seperate>
                </span>
                <span>:</span>
                <span>
                  {item.symbol === "EOCC"
                    ? Math.ceil(Number(item.price))
                    : Number(item.price).toFixed(4)}
                </span>
                <span className={css.unit}>{item.symbol}</span>
              </p>
              {/* <p className={css.almost_price}>≈$1,020.12</p> */}
              <div className={css.HeroBox_bottom_border}></div>
            </div>
          </div>
        ) : (
          <div key={item.id} className={css.HeroBox_container}>
            <div
              className={css.HeroBox}
              onClick={() => {
                view.changeDisplayView("mySaleDetail", item.id);
                marketStore.setSaleHero(item);
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
                  <Seperate>{language.number}</Seperate>
                </span>
                <span>:</span>
                <span>{item.id}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.price}</Seperate>
                </span>
                <span>:</span>
                <span>
                  {item.symbol === "EOCC"
                    ? Math.ceil(Number(item.price))
                    : Number(item.price).toFixed(4)}
                </span>
                <span className={css.unit}>{item.symbol}</span>
              </p>
              {/* <p className={css.almost_price}>≈$1,020.12</p> */}
              <div className={css.HeroBox_bottom_border}></div>
            </div>
            <div className={css.HeroBox_right_border}></div>
          </div>
        );
      });
    } else {
      return saleList.map((item, index) => {
        return index % 2 ? (
          <div key={item.id} className={css.PropBox_container}>
            <div
              className={css.PropBox}
              onClick={() => {
                view.changeDisplayView("myPropsDetail", item.materialKey);
                marketStore.setSaleMaterial(item);
              }}
            >
              <div className={css.CardBox}>
                <PropsCard
                  isList={true}
                  materialKey={item.materialKey}
                  num={item.materialNumber}
                />
              </div>
              <p className={css.status}>{language.Listed}</p>
              <p>
                <span>
                  <Seperate>{language.number}</Seperate>
                </span>
                <span>:</span>
                <span>{item.id}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.amount}</Seperate>
                </span>
                <span>:</span>
                <span>{item.materialNumber}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.price}</Seperate>
                </span>
                <span>:</span>
                <span>
                  {item.symbol === "EOCC"
                    ? Math.ceil(Number(item.price))
                    : Number(item.price).toFixed(4)}
                </span>
                <span className={css.unit}>{item.symbol}</span>
              </p>
              {/* <p className={css.almost_price}>≈$1,020.12</p> */}
              <div className={css.HeroBox_bottom_border}></div>
            </div>
          </div>
        ) : (
          <div key={item.id} className={css.PropBox_container}>
            <div
              className={css.PropBox}
              onClick={() => {
                view.changeDisplayView("myPropsDetail", item.id);
                marketStore.setSaleMaterial(item);
              }}
            >
              <div className={css.CardBox}>
                <PropsCard
                  isList={true}
                  materialKey={item.materialKey}
                  num={item.materialNumber}
                />
              </div>
              <p className={css.status}>{language.Listed}</p>
              <p>
                <span>
                  <Seperate>{language.number}</Seperate>
                </span>
                <span>:</span>
                <span>{item.id}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.amount}</Seperate>
                </span>
                <span>:</span>
                <span>{item.materialNumber}</span>
              </p>
              <p>
                <span>
                  <Seperate>{language.price}</Seperate>
                </span>
                <span>:</span>
                <span>
                  {item.symbol === "EOCC"
                    ? Math.ceil(Number(item.price))
                    : Number(item.price).toFixed(4)}
                </span>
                <span className={css.unit}>{item.symbol}</span>
              </p>
              {/* <p className={css.almost_price}>≈$1,020.12</p> */}
              <div className={css.HeroBox_bottom_border}></div>
            </div>
            <div className={css.HeroBox_right_border}></div>
          </div>
        );
      });
    }
  };

  return (
    <div className={css.Market}>
      <div className={css.SelectorArea}>
        <div className={css.SelectorList}>
          <MarketSelector
            rare={marketStore.rare}
            setRare={(v) => {
              marketStore.setRare(v);
            }}
            hasOrder={false}
          />
        </div>
        <div className={css.DropList}>
          <DropSelect
            label={language.Coin}
            setValue={(v) => {
              marketStore.setDropCoin(v);
            }}
            value={marketStore.dropCoin}
            menuList={marketStore.coinList}
            id="coinD"
          />
          <DropSelect
            label={language.Sort}
            setValue={(v) => {
              marketStore.setDropOrder(v);
            }}
            value={marketStore.dropOrder}
            menuList={marketStore.rare === "Props" ? propsOrderList : orderList}
            id="orderD"
          />
        </div>
      </div>
      <div className={css.HeroArea}>{renderList()}</div>
      <BottomPlaceholder />
    </div>
  );
};

export default inject("view", "userStore", "languageStore")(observer(Market));
