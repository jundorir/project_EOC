// 布阵

import BattleFormationArea from "./BattleFormationArea";
import HeroSelector from "@components/HeroSelector";
import ScrollList from "@components/ScrollList";
import css from "./index.module.less";
import HeroThumbnail, {
  HeroThumbnailPlaceholder,
} from "@components/Thumbnail/HeroThumbnail";
import BottomPlaceholder from "@components/BottomPlaceholder";
import { inject, observer } from "mobx-react";
import {
  Max_Battle_Hero_Number_Limit,
  HeroRarity,
} from "@common/const/define/hero";
import { useEffect, useState } from "react";
import { InfiniteScroll } from "antd-mobile";

function BattleFormation(props) {
  const { userStore } = props;
  const { heroStore } = userStore;
  const [battleHeroList, setBattleHeroList] = useState([
    ...heroStore.battleHeroFormation,
  ]);

  const [page, setPage] = useState(1);
  const [pagesize] = useState(20);
  const [rare, setRare] = useState("ALL");
  const [list, setList] = useState([]);
  const nowLenght = battleHeroList.filter((item) => item !== null).length;
  const beforeLength = heroStore.battleHeroFormation.filter(
    (item) => item !== null
  ).length;

  // updateNumber === 0 无变化   < 0  下阵  >0 上阵
  const updateNumber = nowLenght - beforeLength;
  // console.log("updateNumber ====> ", updateNumber, nowLenght, beforeLength);
  // let isUpdate = false;

  // for (let i = 0; i < Max_Battle_Hero_Number_Limit; i++) {
  //   if (battleHeroList[i] !== heroStore.battleHeroFormation[i]) {
  //     isUpdate = true;
  //     break;
  //   }
  // }

  const showList = list.slice(0, pagesize * page);

  useEffect(() => {
    const tempList = [
      // ...heroStore.battleHeroFormation.filter((item) => item !== null),
      ...heroStore.restHero,
    ];
    if (rare !== "ALL") {
      setList(tempList.filter((item) => item.rarity === HeroRarity[rare]));
    } else {
      setList(tempList);
    }
  }, [rare, heroStore.restHero]);

  useEffect(() => {
    setBattleHeroList([...heroStore.battleHeroFormation]);
  }, [heroStore.battleHeroFormation]);

  async function loadMore() {
    setPage(page + 1);
    return true;
  }
  return (
    <div className={css.battleFormation}>
      <BattleFormationArea
        heroList={battleHeroList}
        initHeroList={heroStore.battleHeroFormation}
        remove={(hero) => {
          setBattleHeroList(
            battleHeroList.map((item) => (item === hero ? null : item))
          );
        }}
        updateNumber={updateNumber}
        onClick={() => {
          heroStore.updateBattleFormation(battleHeroList);
        }}
      />
      <div className={css.cover}>
        <HeroSelector
          rare={rare}
          setRare={(v) => {
            setRare(v);
          }}
          setOrder={(v) => {
            heroStore.setOrder(v);
          }}
        />
      </div>

      <ScrollList className={css.list}>
        {heroStore.battleHeroFormation
          .map((item) => {
            if(item === null) return item;
            if (rare === "ALL" || item.rarity === HeroRarity[rare]) return item;
            return null;
          })
          .map((hero, index) => {
            if (hero === null) return null;
            const checked = battleHeroList[index] === hero;
            return (
              <HeroThumbnail
                key={hero.tokenId}
                hero={hero}
                disabled={updateNumber > 0}
                checked={checked}
                onClick={() => {
                  battleHeroList[index] = checked ? null : hero;
                  setBattleHeroList([...battleHeroList]);
                }}
              />
            );
          })}
        {showList.map((hero, index) => {
          const checked = battleHeroList.includes(hero);
          return (
            <HeroThumbnail
              key={hero.tokenId}
              hero={hero}
              disabled={updateNumber < 0}
              checked={checked}
              onClick={() => {
                if (checked) {
                  setBattleHeroList(
                    battleHeroList.map((item) => (item === hero ? null : item))
                  );
                } else {
                  const emptyIndex = battleHeroList.findIndex(
                    (hero) => hero === null
                  );
                  if (emptyIndex > -1) {
                    battleHeroList[emptyIndex] = hero;
                    setBattleHeroList([...battleHeroList]);
                  }
                }
              }}
            />
          );
        })}
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
        <HeroThumbnailPlaceholder />
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={list.length > page * pagesize}
        >
          <div></div>
        </InfiniteScroll>
      </ScrollList>
      <BottomPlaceholder />
    </div>
  );
}

export default inject("userStore")(observer(BattleFormation));
