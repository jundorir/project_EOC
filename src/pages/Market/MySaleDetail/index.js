// 首页
import { inject, observer } from "mobx-react";

import WrappedHeroCard from "@components/Card/HeroCard";
import Seperate from "@components/Seperate";

import Button from "@components/Button";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const MySaleDetail = (props) => {
  const { view, userStore, languageStore } = props;
  const { marketStore } = userStore;
  const { saleHero } = marketStore;
  const { language } = languageStore;
  async function downHero() {
    try {
      const result = await marketStore.downShelfHero(saleHero.hero.tokenId);
      if (result) {
        view.goBack();
        marketStore.setHero(null);
        return;
      }
    } catch {}
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
          <p className={css.status}>{language.Listed}</p>
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
        </div>
      </div>
      <div className={css.DetailFooter}>
        <Button onClick={downHero}>{language.Removed}</Button>
      </div>
    </div>
  );
};

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(MySaleDetail));
