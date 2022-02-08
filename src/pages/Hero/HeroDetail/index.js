import {
  HeroRarity,
  HeroStatus,
  Hero_Setting,
} from "@common/const/define/hero";
import BottomPlaceholder from "@components/BottomPlaceholder";
import Button from "@components/Button";
import { WrappedHeroCard } from "@components/Card/HeroCard";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import SendHeroModal from "@components/Modal/HeroModal/SendHeroModal";
import ResourceItem from "@components/ResourceItem";
import TopPlaceholder from "@components/TopPlaceholder";
import { Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import css from "./index.module.less";

function HeroDetail(props) {
  const {
    userStore,
    view,
    languageStore: { language },
  } = props;
  const { heroStore } = userStore;
  const [showModal, setShowModal] = useState(null);

  const { Max_Hero_Star_Limit, Max_Hero_Level_Limit } =
    Hero_Setting[heroStore.hero.rarity];

  function renderModal() {
    if (showModal === "authorize") {
      // const isApprove = userStore.MMR_APPROVEMENT - RESET_COST > 0;
      return (
        <MessageModal
          title={language.hero_Confirm_restore}
          onSubmit={toReset}
          closeModal={() => {
            setShowModal(null);
          }}
        >
          <div className={css.content}>
            <div className={css.tips1}>
              <div>{language.hero_operation}</div>
              <div>{language.hero_operation2}</div>
            </div>
          </div>
        </MessageModal>
      );
    }

    if (showModal === "display") {
      const { starLv, rarity, title, Lv } = heroStore.hero;

      const rarityText = HeroRarity[rarity];
      const msg = `Lv.${Lv} ${rarityText} ${starLv}${language.star}s ${title}`;
      const resetMsg = `Lv.1 ${rarityText} 1${language.star} ${title} x${
        2 ** (starLv - 1)
      }`;
      return (
        <MessageModal
          onSubmit={() => {
            view.goBack();
            // heroStore.removeHero(heroStore.hero);
          }}
          closeModal={() => setShowModal(null)}
        >
          <div className={css.content}>
            <div className={css.tips1}>{language.restore_destory}</div>
            <div className={css.tips3}>
              <div className={css.extra}>{msg}</div>
            </div>

            <div className={css.tips1}>{language.restore_result}</div>
            <div className={css.tips3}>
              <div className={css.extra}>{resetMsg}</div>
            </div>
          </div>
        </MessageModal>
      );
    }

    if (showModal === "sendHero") {
      return (
        <SendHeroModal
          hero={heroStore.hero}
          title={language.transfer}
          onSubmit={submitTransfer}
          closeModal={() => {
            setShowModal(null);
          }}
        ></SendHeroModal>
      );
    }
    return null;
  }

  async function toApprove() {
    await userStore.toApprove("MMR");
  }

  async function submitTransfer(address) {
    try {
      const result = await heroStore.sendHeroToOther(address);
      if (result) {
        Toast.show({
          icon: "success",
          content: language.transferSuccess,
        });
        view.goBack();
        return;
      }
    } catch {}
    Toast.show({
      icon: "success",
      content: language.transferFail,
    });
  }

  async function toReset() {
    // todo 还原
    // if (userStore.MMR - RESET_COST <= 0) {
    //   Toast.show("余额不足");
    //   return;
    // }
    const result = await heroStore.resetHero();
    if (result) {
      setShowModal("display");
    }
  }

  function send() {
    // HeroNFT

    setShowModal("sendHero");
  }

  return (
    <div className={css.detail}>
      <TopPlaceholder>
        <Button
          className={css.send}
          onClick={send}
          disabled={heroStore.hero.status !== HeroStatus.REST}
        >
          {language.transfer}
        </Button>
        <ResourceItem type="MMR" number={userStore.MMR} />
      </TopPlaceholder>
      <div className={css.hero}>
        <WrappedHeroCard
          hero={heroStore.hero}
          style={{ transform: "scale(.7)", transformOrigin: "center" }}
        />
      </div>

      <div className={css.operation}>
        <Button
          disabled={
            heroStore.hero.starLv >= Max_Hero_Star_Limit ||
            heroStore.hero.status === HeroStatus.RECLAMATION
          }
          onClick={() => {
            view.changeDisplayView("heroStarUp");
          }}
        >
          {language.hero_Rising_star}
        </Button>
        <Button
          disabled={heroStore.hero.Lv >= Max_Hero_Level_Limit}
          onClick={() => {
            view.changeDisplayView("heroLevelUp");
          }}
        >
          {language.hero_upgrade}
        </Button>
        <Button
          onClick={() => {
            setShowModal("authorize");
          }}
          disabled={
            heroStore.hero.status !== HeroStatus.REST ||
            heroStore.hero.starLv === 1
          }
        >
          {language.hero_reduction}
        </Button>
        <Button
          disabled={
            // 合成条件 ===> 卡牌处于闲置 未强化 且卡牌稀有度低于SSR
            heroStore.hero.status !== HeroStatus.REST ||
            heroStore.hero.starLv !== 1 ||
            heroStore.hero.rarity >= HeroRarity.SSR
          }
          onClick={() => {
            view.changeDisplayView("heroSynthesis");
          }}
        >
          {language.hero_synthesis}
        </Button>
        {/* <div className={css.tips}>消耗500MMR</div> */}
      </div>
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
}

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(HeroDetail));
