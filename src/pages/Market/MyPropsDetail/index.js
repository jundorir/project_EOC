// 首页
import { inject, observer } from "mobx-react";
import PropsCard from "@components/Card/PropsCard";

import Seperate from "@components/Seperate";

import Button from "@components/Button";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const MySaleDetail = (props) => {
  const { view, userStore, languageStore } = props;
  const { marketStore } = userStore;
  const { saleMaterial } = marketStore;
  const { language } = languageStore;
  async function downHero() {
    try {
      const result = await marketStore.downShelfMaterial(
        saleMaterial.order_id,
        saleMaterial.materialKey
      );
      if (result) {
        view.goBack();
        marketStore.setSaleMaterial(null);
        return;
      }
    } catch {}
  }

  return (
    <div className={css.SaleDetail}>
      <div className={css.ContentBox}>
        <div className={css.CardBox}>
          <PropsCard
            size="l"
            materialKey={saleMaterial.materialKey}
          ></PropsCard>
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
