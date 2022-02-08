import ScrollList from "@components/ScrollList";
import css from "./index.module.less";
import HeroThumbnail, {
  HeroThumbnailPlaceholder,
} from "@components/Thumbnail/HeroThumbnail";
import BottomPlaceholder from "@components/BottomPlaceholder";
import HeroStarUp from "./HeroStarUp";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import IntensifySuccessModal from "@components/Modal/HeroModal/IntensifySuccessModal";
import {
  Hero_StarUp_Requirement,
  Hero_Setting,
} from "@common/const/define/hero";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import TopPlaceholder from "@components/TopPlaceholder";
import ResourceItem from "@components/ResourceItem";

function StarUp(props) {
  const {
    userStore,
    languageStore: { language },
  } = props;
  const { heroStore } = userStore;
  const [selectedHero, setSelectedHero] = useState(null);
  const [showModal, setShowModal] = useState(null);
  // 升星 必须同种卡牌 同星级 2合1
  const cost = Hero_StarUp_Requirement[heroStore.hero.rarity];

  const { Max_Hero_Star_Limit } = Hero_Setting[heroStore.hero.rarity];
  const isEnoughCost = userStore.GOLD >= cost;

  const list = heroStore.restHero.filter(
    (item) =>
      item.key === heroStore.hero.key &&
      item.starLv === heroStore.hero.starLv &&
      item.id !== heroStore.hero.id
  );

  async function toStarUp() {
    const result = await heroStore.starUp(selectedHero);
    if (result) {
      setShowModal(heroStore.hero);
      setSelectedHero(null);
      console.log(selectedHero);
    }
  }

  function renderModal() {
    if (showModal === "confirm") {
      return (
        <MessageModal
          closeModal={() => {
            setShowModal(null);
          }}
          title={language.confirm}
          onSubmit={toStarUp}
        >
          <div className={css.content}>
            <div className={css.tips2}>
              <div>{language.hero_Rising_star_tips1}</div>
            </div>
            <div className={css.tips1}>
              <div>{language.hero_Rising_star_tips2}</div>
              <div>{language.hero_Rising_star_tips3}</div>
            </div>
          </div>
        </MessageModal>
      );
    }

    if (showModal) {
      return (
        <IntensifySuccessModal
          title={language.hero_Rising_star_success}
          hero={showModal}
          closeModal={() => {
            setShowModal(null);
          }}
        ></IntensifySuccessModal>
      );
    }

    return null;
  }

  return (
    <div className={css.starUp}>
      <TopPlaceholder>
        <ResourceItem type="GOLD" number={userStore.GOLD} />
      </TopPlaceholder>
      <HeroStarUp
        heroList={[heroStore.hero, selectedHero]}
        disabled={
          !selectedHero ||
          !isEnoughCost ||
          heroStore.hero.starLv >= Max_Hero_Star_Limit
        }
        cost={cost}
        onSubmit={() => {
          setShowModal("confirm");
        }}
      />
      <div className={css.cover}>
        <div className={css.left}>
          {language.hero_Optional}: {list.length}
        </div>
        <div className={css.right}>{language.hero_Add_same}</div>
      </div>
      <ScrollList className={css.list}>
        {list.map((item) => {
          const checked = item === selectedHero;
          return (
            <HeroThumbnail
              key={item.id}
              hero={item}
              checked={checked}
              onClick={() => {
                setSelectedHero(checked ? null : item);
              }}
            />
          );
        })}
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
      </ScrollList>
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
}

export default inject("view", "userStore", "languageStore")(observer(StarUp));
