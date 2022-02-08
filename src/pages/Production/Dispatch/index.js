import Button from "@components/Button";
import HeroSelector from "@components/HeroSelector";
import GeneralModal from "@components/Modal/GeneralModal";
import PageContainer from "@components/PageContainer";
import ScrollList from "@components/ScrollList";
import HeroThumbnail, {
  HeroThumbnailPlaceholder,
} from "@components/Thumbnail/HeroThumbnail";
import classNames from "classnames";
import React, { useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import {
  baseCoin,
  heroAddition,
  HeroRarity,
  HeroStatus,
} from "@common/const/define/hero";

function Dispatch(props) {
  const {
    userStore,
    languageStore: { language },
  } = props;
  const { heroStore, productionStore } = userStore;
  const { nowhave, totalOutput, unclaimed } = productionStore;
  const [rare, setRare] = useState("ALL");
  const [newReclamationHeroList, setNewReclamationHeroList] = useState([]);
  const [reclamationHeroList, setReclamationHeroList] = useState([
    ...heroStore.reclamationHero,
  ]);
  const [showList, setShowList] = useState([]);

  const canTotalDispatch = nowhave * 10;

  const isRevocation =
    heroStore.reclamationHero.length !== reclamationHeroList.length;
  const isAdd = newReclamationHeroList.length > 0;

  const isActionAdd = newReclamationHeroList.length > 0;

  React.useEffect(() => {
    const list = [...heroStore.reclamationHero, ...heroStore.restHero];
    if (rare !== "ALL") {
      setShowList(list.filter((item) => item.rarity === HeroRarity[rare]));
    } else {
      setShowList(list);
    }
  }, [rare, heroStore.restHero, heroStore.reclamationHero]);

  function selectHandle(hero, checked) {
    if (
      !checked &&
      reclamationHeroList.length + newReclamationHeroList.length >=
        canTotalDispatch
    ) {
      GeneralModal.alert({
        content: language.max_dispatch(canTotalDispatch),
      });
      return;
    }
    if (heroStore.reclamationHero.includes(hero)) {
      if (checked) {
        if (
          heroStore.reclamationHero.length - reclamationHeroList.length >=
          20
        ) {
          return GeneralModal.alert({
            content: language.revocation_dispatch_limit,
          });
        }
        setReclamationHeroList(
          reclamationHeroList.filter((item) => item !== hero)
        );
      } else {
        setReclamationHeroList([...reclamationHeroList, hero]);
      }
    } else {
      if (checked) {
        setNewReclamationHeroList(
          newReclamationHeroList.filter((item) => item !== hero)
        );
      } else {
        if (newReclamationHeroList.length === 20) {
          return GeneralModal.alert({
            content: language.dispatch_limit,
          });
        }
        setNewReclamationHeroList([...newReclamationHeroList, hero]);
      }
    }
  }

  async function dispatchHandle() {
    let result;
    let action = "";

    // 撤销派遣
    if (isRevocation) {
      action = language.revocation_dispatch;
      result = await heroStore.removeHeroAsync(
        heroStore.reclamationHero.filter(
          (hero) => !reclamationHeroList.includes(hero)
        )
      );
    } else {
      action = language.dispatch;
      result = await heroStore.sendHeroAsync(newReclamationHeroList);
    }

    if (result) {
      GeneralModal.alert({
        content: `${action}${language.success}！`,
      });
      setNewReclamationHeroList([]);
      setReclamationHeroList([...heroStore.reclamationHero]);
    } else {
      Toast.show({
        icon: "fail",
        content: `${action}${language.fial}`,
        duration: 500,
      });
    }
  }

  function renderSendHandleBtnText() {
    if (isActionAdd) {
      return language.dispatch;
    }
    if (isRevocation) {
      return language.revocation_dispatch;
    }
    return language.dispatch_done;
  }

  const adding = (
    ([...reclamationHeroList, ...newReclamationHeroList].reduce(
      (prev, next) => {
        return prev + heroAddition[HeroRarity[next.rarity]];
      },
      0
    ) /
      100) *
    baseCoin
  ).toFixed(3);
  return (
    <PageContainer className={css.container}>
      <div className={css.header}>
        <div>
          <p className={css.left}>
            {language.farmland}：{nowhave}
          </p>
          <p className={css.right}>
            {language.dispatch_hero}：
            {reclamationHeroList.length + newReclamationHeroList.length}/
            {10 * nowhave}
          </p>
        </div>
        <div>
          {/* <p className={css.left}>
            {language.base_output}：<span>{baseCoin}EOCC</span>
          </p> */}
          <p className={css.left}>
            {language.dispatch_adding}：<span>{adding}EOCC</span>
          </p>
        </div>
      </div>
      <ScrollList className={classNames(css.selected_list, css.show_more)}>
        {reclamationHeroList.map((hero) => (
          <HeroThumbnail
            disabled={isActionAdd}
            key={hero.id}
            hero={hero}
            onClick={() => {
              if (
                heroStore.reclamationHero.length - reclamationHeroList.length >=
                20
              ) {
                GeneralModal.alert({
                  content: language.revocation_dispatch_limit,
                });
                return;
              }
              setReclamationHeroList(
                reclamationHeroList.filter((item) => item !== hero)
              );
            }}
          />
        ))}
        {newReclamationHeroList.map((hero) => (
          <HeroThumbnail
            key={hero.id}
            hero={hero}
            onClick={() => {
              setNewReclamationHeroList(
                newReclamationHeroList.filter((item) => item !== hero)
              );
            }}
          />
        ))}
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
      </ScrollList>
      <div className={css.selector}>
        <HeroSelector
          rare={rare}
          setRare={setRare}
          setOrder={(v) => heroStore.setOrder(v)}
        />
      </div>
      <ScrollList className={css.hero_list}>
        {showList.map((hero) => {
          const checked =
            reclamationHeroList.includes(hero) ||
            newReclamationHeroList.includes(hero);
          const disabled =
            (isRevocation && !heroStore.reclamationHero.includes(hero)) ||
            (isAdd && heroStore.reclamationHero.includes(hero));
          return (
            <HeroThumbnail
              disabled={disabled}
              checked={checked}
              onClick={() => selectHandle(hero, checked)}
              key={hero.id}
              hero={hero}
            />
          );
        })}
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
      </ScrollList>
      <div className="footer">
        <div className={css.actions}>
          {/* <Button>智能选择</Button> */}
          <Button
            disabled={!(isRevocation || isAdd)}
            onClick={() => {
              dispatchHandle();
            }}
          >
            {renderSendHandleBtnText()}
          </Button>
        </div>
        <div className={css.tips}>{language.dispatch_tip}</div>
      </div>
    </PageContainer>
  );
}

export default inject("view", "userStore", "languageStore")(observer(Dispatch));
