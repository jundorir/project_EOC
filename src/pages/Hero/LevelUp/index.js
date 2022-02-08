// 英雄升级

import BottomPlaceholder from "@components/BottomPlaceholder";
// import Button from "@components/Button";
import { WrappedHeroCard } from "@components/Card/HeroCard";
import MaterialCard from "@components/Card/MaterialCard";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import Progress from "@components/Progress";
import { useState } from "react";
import MaterialModal from "@components/Modal/HeroModal/MaterialModal";
import { Toast } from "antd-mobile";

function LevelUp(props) {
  const {
    userStore,
    languageStore: { language },
  } = props;
  const { heroStore, materialStore } = userStore;
  const { Lv, exp } = heroStore.hero;
  const nextLevelExp = Lv ** 2 * 500;
  const nowLevelExp = (Lv - 1) ** 2 * 500;
  const upLevelExp = nextLevelExp - nowLevelExp;
  let moreExp = exp - nowLevelExp;
  if (moreExp > upLevelExp) {
    moreExp = upLevelExp;
  }
  let progressPercnet = moreExp / upLevelExp.toFixed(4);

  const [showModal, setShowModal] = useState(null);

  async function submitLvUp(value) {
    // 使用经验书
    try {
      const result = await materialStore.useExpBook(
        heroStore.hero,
        showModal,
        value
      );

      await heroStore.queryHeroDetail(heroStore.hero.tokenId);

      if (result) {
        Toast.show({
          icon: "success",
          content: language.Use_success,
        });
        setShowModal(null);
        return;
      }
    } catch {}

    Toast.show({
      icon: "fail",
      content: language.Use_failed,
    });
    setShowModal(null);
  }

  function renderModal() {
    if (showModal) {
      return (
        <MaterialModal
          title={language.hero_upgrade}
          materialKey={showModal}
          quantity={materialStore[showModal]}
          onSubmit={(value) => {
            submitLvUp(value);
          }}
          closeModal={() => {
            setShowModal(null);
          }}
        />
      );
    }
    return null;
  }

  return (
    <div className={css.LevelUp}>
      <div className={css.hero}>
        <WrappedHeroCard
          hero={heroStore.hero}
          style={{ transform: "scale(.7)", transformOrigin: "center" }}
        />
      </div>

      <div className={css.box}>
        <Progress percent={progressPercnet * 100} />
        <div className={css.number}>
          <div className={css.left}>LV: {Lv}</div>
          <div className={css.right}>
            {moreExp}/{upLevelExp}
          </div>
        </div>
        <div className={css.materialList}>
          {[
            "ExperienceBookPrimary",
            // "ExperienceBookIntermediate",
            "ExperienceBookSenior",
          ].map((key) => (
            <MaterialCard
              materialKey={key}
              key={key}
              onClick={() => {
                if (materialStore[key] > 0) {
                  setShowModal(key);
                }
              }}
              quantity={materialStore[key]}
            />
          ))}
        </div>
      </div>
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
}

export default inject("userStore", "languageStore")(observer(LevelUp));
