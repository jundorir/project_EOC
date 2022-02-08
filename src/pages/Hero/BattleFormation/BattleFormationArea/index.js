import css from "./index.module.less";
import { Max_Battle_Hero_Number_Limit } from "@common/const/define/hero";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import Button from "@components/Button";
import classNames from "classnames";
import { inject, observer } from "mobx-react";

function BattleFormationArea(props) {
  const {
    heroList,
    remove,
    updateNumber,
    onClick,
    initHeroList,
    languageStore: { language },
  } = props;
  const totalPower = heroList.reduce((pre, now) => pre + (now?.power ?? 0), 0);

  function renderList(startIndex, endIndex) {
    return heroList.slice(startIndex, endIndex).map((hero, index) => {
      const isBeforeHas = hero !== null && initHeroList.includes(hero);
      return (
        <HeroThumbnail
          disabled={updateNumber > 0 && isBeforeHas}
          hero={hero}
          key={startIndex + index}
          onClick={() => {
            remove(hero);
          }}
        />
      );
    });
  }

  return (
    <div className={css.battleFormationArea}>
      <div className={classNames(css.list, css.one)}>{renderList(0, 2)}</div>
      <div className={css.list}>
        {renderList(2, Max_Battle_Hero_Number_Limit)}
      </div>
      <div className={css.bottom}>
        <div className={css.power}>Power: {totalPower}</div>
        <Button
          className={css.btn}
          disabled={updateNumber === 0}
          onClick={onClick}
        >
          {language.confirm}
        </Button>
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(BattleFormationArea));
