import Button from "@components/Button";
import HeroCard from "@components/Card/HeroCard";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
function HeroStarUp(props) {
  const {
    heroList = [],
    onSubmit,
    disabled,
    cost,
    languageStore: { language },
  } = props;

  function renderCard() {
    return heroList.map((item, index) => {
      if (item === null) {
        return (
          <div
            className={classNames(css.item, index === 1 && css.last, css.empty)}
            key="empty"
          >
            {language.hero_Add_cards}
          </div>
        );
      }
      return (
        <div
          className={classNames(css.item, index === 1 && css.last)}
          key={item.id}
        >
          <HeroCard
            hero={item}
            style={{
              transform: "scale(.37)",
              transformOrigin: "left top",
            }}
          />
        </div>
      );
    });
  }

  return (
    <div className={css.heroStarUp}>
      <div className={css.list}>{renderCard()}</div>
      <Button className={css.button} onClick={onSubmit} disabled={disabled}>
        {language.hero_Confirm_rising}
      </Button>
      <div className={css.tips}>
        {language.cost}
        {cost}EOCC
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(HeroStarUp));
