import css from "./index.module.less";
import classNames from "classnames";

function UnknowHeroThumbnailPlaceholder(props) {
  const { checked = false, rarity, onClick } = props;
  return (
    <div
      className={classNames(
        css.unknowHeroThumbnail,
        css[rarity],
        checked && css.checked
      )}
      onClick={() => {
        onClick?.();
      }}
    >
      <div className={css.avatar}></div>
    </div>
  );
}

export default UnknowHeroThumbnailPlaceholder;
