// 合成

import HeroSybthesis from "./HeroSybthesis";
import ScrollList from "@components/ScrollList";
import css from "./index.module.less";
import BottomPlaceholder from "@components/BottomPlaceholder";
import HeroThumbnail, {
  HeroThumbnailPlaceholder,
} from "@components/Thumbnail/HeroThumbnail";
import { inject, observer } from "mobx-react";
import { Hero_Sybthesis_Requirement } from "@common/const/define/hero";
import IntensifySuccessModal from "@components/Modal/HeroModal/IntensifySuccessModal";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import { useEffect, useState } from "react";
import TopPlaceholder from "@components/TopPlaceholder";
import ResourceItem from "@components/ResourceItem";

function Sybthesis(props) {
  const {
    userStore,
    view,
    languageStore: { language },
  } = props;
  const { heroStore } = userStore;
  const [requirement, setRequirement] = useState(
    Hero_Sybthesis_Requirement[heroStore.hero.rarity]
  );
  const [isEnoughCost] = useState(userStore.GOLD >= requirement.cost);
  const [materialHeroList, setMaterialHeroList] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [list, setList] = useState([]);
  async function toSynthesis() {
    const result = await heroStore.synthesis(materialHeroList);
    console.log("result", result);
    if (result) {
      setShowModal("sybthesisSuccess");
    } else {
      setShowModal("sybthesisFail");
    }
  }

  useEffect(() => {
    //  重置材料卡牌
    setRequirement(Hero_Sybthesis_Requirement[heroStore.hero.rarity]);
    setMaterialHeroList([]);
    setList(
      heroStore.restHero.filter(
        (item) =>
          // 材料卡牌只能是 同种卡牌的 未强化过的卡牌
          item.baseId === heroStore.hero.baseId &&
          item.tokenId !== heroStore.hero.tokenId &&
          item.starLv === 1
      )
    );
  }, [heroStore.hero, heroStore.restHero]);

  function renderModal() {
    if (showModal === "confirm") {
      return (
        <MessageModal
          closeModal={() => {
            setShowModal(null);
          }}
          title={language.confirm}
          onSubmit={toSynthesis}
        >
          <div className={css.content}>
            <div className={css.tips1}>
              <div>{language.confirmSynthesis}</div>
            </div>
            <div className={css.tips2}>
              <div>{language.confirmSynthesisTips1}</div>
              <div>{language.confirmSynthesisTips2}</div>
            </div>
          </div>
        </MessageModal>
      );
    }

    if (showModal === "sybthesisFail") {
      return (
        <MessageModal
          closeModal={() => {
            setShowModal(null);
          }}
          title={language.hero_sybthesisFail}
        >
          <div className={css.content}>
            <div className={css.tips2}>
              <div>{language.hero_reback}</div>
            </div>
            <div className={css.tips2}></div>
          </div>
        </MessageModal>
      );
    }

    if (showModal) {
      return (
        <IntensifySuccessModal
          hero={heroStore.hero}
          closeModal={() => {
            setShowModal(null);
          }}
        ></IntensifySuccessModal>
      );
    }

    return null;
  }

  return (
    <div className={css.synthesis}>
      <TopPlaceholder>
        <ResourceItem type="GOLD" number={userStore.GOLD} />
      </TopPlaceholder>
      <HeroSybthesis
        requirement={requirement}
        number={materialHeroList.length + 1}
        hero={heroStore.hero}
        disabled={
          materialHeroList.length + 1 !== requirement.quantity || !isEnoughCost
        }
        confirm={() => {
          setShowModal("confirm");
        }}
      />
      <div className={css.cover}>
        {language.hero_Optional}: {list.length}
      </div>

      <ScrollList className={css.list}>
        {list.map((hero, index) => {
          const checked = materialHeroList.includes(hero);
          return (
            <HeroThumbnail
              key={index}
              hero={hero}
              checked={checked}
              onClick={() => {
                if (checked) {
                  setMaterialHeroList(
                    materialHeroList.filter((item) => item !== hero)
                  );
                } else {
                  if (materialHeroList.length + 1 < requirement.quantity) {
                    setMaterialHeroList([...materialHeroList, hero]);
                  }
                }
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

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(Sybthesis));
