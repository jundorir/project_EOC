import React from "react";
import tipPng from "@assets/images/production/tip.png";
import css from "./index.module.less";
import GeneralModal from "@components/Modal/GeneralModal";
import { inject, observer } from "mobx-react";
import { baseCoin, heroAddition, HeroRarity } from "@common/const/define/hero";

function Infolist(props) {
  const {
    userStore,
    languageStore: { language },
  } = props;
  const { productionStore, heroStore } = userStore;
  const { nowhave, totalOutput, unclaimed } = productionStore;
  function showDispatchGain() {
    GeneralModal.alert({
      title: language.dispatch_modal_title,
      content: (
        <>
          <p>
            {language.dispatch_modal_expain_1}
            <br />
            {language.dispatch_modal_expain_2}
          </p>
          {new Array(5).fill(0).map((_, i) => (
            <p key={HeroRarity[i + 1]} className={css.cell}>
              <span>{HeroRarity[i + 1]}</span>
              <span>{heroAddition[HeroRarity[i + 1]]}%</span>
            </p>
          ))}
        </>
      ),
    });
  }

  return (
    <ul className={css.info_list}>
      <li className={css.number_cell}>
        <img
          src={require("@assets/images/production/farmland.png").default}
          alt=""
        />
        <span>{nowhave}</span>
      </li>
      <li className={css.number_cell}>
        <img
          src={require("@assets/images/production/hero.png").default}
          alt=""
        />
        <span>{heroStore.reclamationHero.length}</span>
      </li>
      <li
        onClick={() => {
          GeneralModal.alert({
            title: language.union_modal_title,
            content: language.union_modal_content,
          });
        }}
        className={css.number_cell}
      >
        <img
          src={require("@assets/images/production/union.png").default}
          alt=""
        />
        <span>{userStore.unionStore.unionInfo.bonus || 0}%</span>
        <div className={css.tip}></div>
      </li>
      <li onClick={showDispatchGain} className={css.number_cell}>
        <img
          src={require("@assets/images/production/dis.png").default}
          alt=""
        />
        <span>{(baseCoin * totalOutput).toFixed(2)} </span>
        <div className={css.tip}></div>
      </li>
      <li className={css.number_cell}>
        <img
          src={require("@assets/images/production/dialy.png").default}
          alt=""
        />
        <span>
          {(
            (baseCoin * nowhave + baseCoin * totalOutput) *
            (1 + (userStore.unionStore.unionInfo.bonus || 0) / 100)
          ).toFixed(2)}{" "}
        </span>
      </li>
    </ul>
  );
}

export default inject("userStore", "languageStore")(observer(Infolist));
