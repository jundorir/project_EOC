// 首页
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import PropsCard from "@components/Card/PropsCard";

import MarketSelector from "@components/MarketSelector";
import Button from "@components/Button";
import Seperate from "@components/Seperate";
import SearchBtn from "@assets/images/market/search_btn.png";
import sanjiao from "@assets/images/market/sanjiao.png";

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

  //搜索界面控制
  const [search, setSearch] = useState(false);
  //当前搜索文本
  const [curSearch, setCurSearch] = useState("");
  //搜索分类 true-英雄 false-道具
  const [searchType, setSearchType] = useState(true);

  function changeHandle({ target: { value } }) {
    setCurSearch(value);
  }

  function changeSearchArea() {
    setSearchType(!searchType);
  }
  function searchHandle(value) {
    if (localStorage.getItem("searchHistoryList")) {
      localStorage.setItem(
        "searchHistoryList",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("searchHistoryList")),
          value,
        ])
      );
    } else {
      localStorage.setItem("searchHistoryList", JSON.stringify([value]));
    }
    if (searchType) {
      marketStore.setRare("ALL", true);
      marketStore.queryMarketHeroList(value);
    } else {
      marketStore.setRare("Props", true);
      marketStore.queryMarketMaterialList(value);
    }
    setSearch(false);
    setCurSearch(value);
  }
  function clearSearchHandle() {
    setCurSearch("");
    if (marketStore.rare !== "Props") {
      marketStore.queryMarketHeroList();
    } else {
      marketStore.queryMarketMaterialList();
    }
  }

  useEffect(() => {
    marketStore.setViewer("market");
  }, []);
  useEffect(() => {
    if (marketStore.rare !== "Props") {
      marketStore.queryMarketHeroList();
    } else {
      marketStore.queryMarketMaterialList();
    }
    marketStore.queryAllowance("USDT");
    marketStore.queryAllowance("MMR");
    marketStore.queryAllowance("GOLD");
  }, [marketStore]);

  const renderList = () => {
    if (marketStore.rare !== "Props") {
      return saleList.map((item, index) => {
        return index % 2 ? (
          <div key={item.id} className={css.HeroBox_container}>
            <div
              className={css.HeroBox}
              onClick={() => {
                view.changeDisplayView("saleDetail", item.id);
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
                view.changeDisplayView("saleDetail", item.id);
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
                console.log(item.materialKey);
                view.changeDisplayView("propsDetail", item.materialKey);
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
                view.changeDisplayView("propsDetail", item.id);
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

  if (search) {
    return (
      <div className={css.MarketSearch}>
        <div className={css.SelectorArea}>
          <div className={css.SearchBox}>
            <div onClick={changeSearchArea} className={css.SearchType}>
              {searchType ? "Hero" : "Material"}
              <img src={sanjiao} />
            </div>

            <input
              value={curSearch}
              onChange={changeHandle}
              autoComplete="off"
              name="searchText"
              placeholder={language.Search_number_address}
              type="text"
            />
            <img
              src={SearchBtn}
              className={css.SearchBtn}
              onClick={() => searchHandle(curSearch)}
            />
          </div>
        </div>
        <div className={css.Search_Result_Box}>
          <div className={css.Search_Result_title}>
            {[...new Set(JSON.parse(localStorage.getItem("searchHistoryList")))]
              .length > 0
              ? language.latest_search
              : ""}
          </div>
          <div className={css.Search_history_List}>
            {[
              ...new Set(JSON.parse(localStorage.getItem("searchHistoryList"))),
            ].map((item, index) => {
              return (
                <div
                  key={index}
                  className={css.Search_history_item}
                  onClick={() => searchHandle(item)}
                >
                  {item}
                  <div className={css.HeroBox_bottom_border}></div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={css.Search_Back_Btn}
          onClick={() => setSearch(false)}
        ></div>

        <BottomPlaceholder />
      </div>
    );
  }
  return (
    <div className={css.Market}>
      <div className={css.SelectorArea}>
        <div className={css.SelectorList}>
          <MarketSelector
            rare={marketStore.rare}
            setRare={(v) => {
              setCurSearch("");
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
          <img
            src={SearchBtn}
            className={css.SearchBtn}
            onClick={() => {
              setCurSearch("");
              setSearch(true);
            }}
          />
        </div>
        {curSearch && (
          <div className={css.CurSearchArea}>
            <div className={css.CurSearchArea_left}>
              <span>{language.search_text}:</span>
              <span>{curSearch}</span>
            </div>
            <div
              className={css.CurSearchArea_right}
              onClick={clearSearchHandle}
            >
              {language.clear}
            </div>
          </div>
        )}
      </div>
      <div className={css.HeroArea}>
        {renderList()}
        <div className={css.SwitchBtns}>
          <Button
            onClick={() => {
              view.changeDisplayView("sale");
            }}
          >
            {language.Sale}
          </Button>

          <Button
            onClick={() => {
              view.changeDisplayView("mySale");
            }}
          >
            {language.My_Sale}
          </Button>
        </div>
      </div>
      <BottomPlaceholder />
    </div>
  );
};

export default inject("view", "userStore", "languageStore")(observer(Market));
