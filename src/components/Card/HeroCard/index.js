// 英雄卡片

import css from "./index.module.less";
import classNames from "classnames";
import { HeroRarity, Hero_Setting } from "@common/const/define/hero";
function HeroCard(props) {
  const { hero, style } = props;

  if (hero === null) {
    return <div className={css.heroCard} style={style} />;
  }

  const {
    atk = 1000, // 攻击力
    def = 1000, // 防御
    power = 50000, // 战斗力
    title = "威廉.腓特烈", // 英雄名称
    key = "1",
    Lv = 30, // 等级
    starLv = 4, // 星级
    rarity = 4, // 稀有度
    uri,
  } = hero;
  // console.log(hero)
  const rarityText = HeroRarity[rarity];
  // console.log("rarity", rarity);
  const { Max_Hero_Star_Limit } = Hero_Setting[rarity];

  return (
    <div className={css.heroCard} style={style}>
      <div className={classNames(css[`gem_${rarityText}`], css.rarity)}>
        {rarityText}
      </div>
      <div className={css.title}>{title}</div>
      <div
        className={css.hero}
        // className={css[`hero_${key}`]}
        style={uri && { backgroundImage: `url(${uri})` }}
      >
        <div className={css.powerBg}>
          <div className={css.power}>POWER:{power}</div>
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <div
            className={classNames(
              css[`star_${item}`],
              starLv >= item && css.full,
              item > Max_Hero_Star_Limit && css.block
            )}
            key={item}
          />
        );
      })}
      <div className={css.box}>
        <div className={css.atk}>{atk}</div>
        <div className={css.def}>{def}</div>
      </div>
      <div className={classNames(css[`gem_${rarityText}`], css.lv)}>{Lv}</div>
    </div>
  );
}

export default HeroCard;

function WrappedHeroCard(props) {
  const { style, ...others } = props;
  return (
    <div className={css.wrap} style={style}>
      <HeroCard {...others} />
    </div>
  );
}

export { WrappedHeroCard };
