// 英雄

import { HeroRarity } from "@common/const/define/hero";
import BottomPlaceholder from "@components/BottomPlaceholder";
import Button from "@components/Button";
import HeroSelector from "@components/HeroSelector";
import ScrollList from "@components/ScrollList";
import HeroThumbnail, {
  HeroThumbnailPlaceholder,
} from "@components/Thumbnail/HeroThumbnail";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import css from "./index.module.less";
import { InfiniteScroll } from "antd-mobile";
import TopPlaceholder from "@components/TopPlaceholder";

function Hero(props) {
  const {
    view,
    userStore,
    languageStore: { language },
  } = props;
  const { heroStore } = userStore;

  const [rare, setRare] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagesize] = useState(20);

  async function loadMore() {
    setPage(page + 1);
    return true;
  }

  let list = heroStore.heroList;
  if (rare !== "ALL") {
    list = heroStore.heroList.filter(
      (item) => item.rarity === HeroRarity[rare]
    );
  }
  const showList = list.slice(0, pagesize * page);

  React.useEffect(() => {
    heroStore.queryHeroList();
  }, [heroStore]);

  return (
    <div className={css.hero}>
      <TopPlaceholder className={css.selector}>
        <HeroSelector
          rare={rare}
          setRare={(v) => {
            setRare(v);
          }}
          setOrder={(v) => {
            heroStore.setOrder(v);
          }}
        />
      </TopPlaceholder>

      <ScrollList className={css.list}>
        {showList.map((item, index) => (
          <HeroThumbnail
            key={index}
            hero={item}
            onClick={() => {
              heroStore.setHero(item);
              view.changeDisplayView("heroDetail");
            }}
          />
        ))}
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
      <div className={css.operation}>
        <Button
          onClick={() => {
            view.changeDisplayView("market");
          }}
        >
          {language.hero_transaction}
        </Button>

        <Button
          onClick={() => {
            view.changeDisplayView("battleFormation");
          }}
        >
          {language.hero_arrangement}
        </Button>
      </div>
      <BottomPlaceholder />
    </div>
  );
}

export default inject("view", "userStore", "languageStore")(observer(Hero));
