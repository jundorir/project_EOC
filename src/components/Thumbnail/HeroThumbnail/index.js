import css from "./index.module.less";
import { HeroStatus, HeroRarity } from "@common/const/define/hero";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import BATTLE_LOGO from "@assets/images/thumb/BATTLE.png";
import RECLAMATION_LOGO from "@assets/images/thumb/RECLAMATION.png";
import HIRELOGO from "@assets/images/thumb/HIRE.png";
import RENTING_LOGO from "@assets/images/thumb/RENTING.png";
const HeroThumbnail = (props) => {
  const {
    hero,
    onClick,
    checked = false,
    disabled = false,
    showTitle = true,
    titleEllipsis = false,
    showStatus = true,
    languageStore: { language },
  } = props;
  const HeroStatusLogo = {
    [HeroStatus.REST]: "", //休息
    [HeroStatus.BATTLE]: BATTLE_LOGO, //上阵
    [HeroStatus.RECLAMATION]: RECLAMATION_LOGO, //开垦
    [HeroStatus.RENTAL_MARKET]: HIRELOGO, //租赁市场
    [HeroStatus.RENTING]: RENTING_LOGO, //出租中
    [HeroStatus.HIRE]: HIRELOGO, //租借的
  };

  function handleClick() {
    if (!disabled) {
      onClick?.();
    }
  }

  if (hero === null) {
    return (
      <div
        className={css.thumbnail}
        onClick={() => {
          handleClick();
        }}
      >
        <div className={classNames(css.avatarBox, css.empty)}></div>
        <div className={css.title}>{language.hero_Add_cards}</div>
      </div>
    );
  }

  const {
    title = "", //
    key = "1",
    Lv = 30, //
    starLv = 5, //
    rarity = 1, //
    status = 2,
    head_url,
  } = hero;

  const rarityText = HeroRarity[rarity];

  return (
    <div
      className={classNames(
        css.thumbnail,
        checked && css.checked,
        disabled && css.disabled
      )}
      onClick={() => {
        handleClick();
      }}
    >
      <div className={css.combo}>
        <div className={css.avatarBox}>
          <div
            className={classNames(css.avatar, css.hero, css[rarityText])}
            style={{ backgroundImage: `url(${head_url})` }}
          >
            <div className={css.cover} />
          </div>
        </div>
        <div className={css.avatarCover} />
      </div>

      <div className={classNames(css.avatarBox, css.free)}>
        <div className={classNames(css.avatar, css[rarityText])}>
          <div className={css.top}>
            <div>Lv.{Lv}</div>
            {checked ? (
              <div className={css.checked}> </div>
            ) : (
              <div className={css.rarity}>{rarityText}</div>
            )}
          </div>
          <div className={css.bottom}>
            <div className={css.starBox}>
              <div className={css.star}></div>
              {starLv}
            </div>
            {!checked && showStatus && (
              <div className={css.status} style={{backgroundImage: `url(${(HeroStatusLogo[status])})`}}/>
            )}
          </div>
        </div>
      </div>
      {showTitle && <div className={classNames(css.title, titleEllipsis && css.titleEllipsis )}>{title}</div>}
    </div>
  );
};

export default inject("languageStore")(observer(HeroThumbnail));

function HeroThumbnailPlaceholder() {
  return <div className={css.thumbnailPlaceholder}></div>;
}

export { HeroThumbnailPlaceholder };
