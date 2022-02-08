// 道具卡片--市场用
import useMaterial from "@common/const/define/Material";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
function PropsCard(props) {
  const {
    materialKey,
    onClick,
    size = "s", //s-小卡片，m-中卡片，l-大卡片
    isList = false,
    num,
    languageStore: { language },
  } = props;
  const Material = useMaterial(language);
  const info = Material[materialKey];
  if (isList) {
    return (
      <div
        className={css.material}
        onClick={() => {
          onClick?.();
        }}
      >
        <img src={info.images} alt="" className={css.images} />
        <div className={css.quantity}>{num}</div>
        <div className={css.title}>{info.title}</div>
      </div>
    );
  }
  return (
    <div
      className={css.PropsCard}
      onClick={() => {
        onClick?.();
      }}
    >
      {size === "s" ? (
        <img src={info.images} alt="" className={css.images_s} />
      ) : (
        <img src={info.images} alt="" className={css.images} />
      )}

      {size === "s" && <p className={css.title_s}>{info.title}</p>}
      {size === "m" && <p className={css.title_m}>{info.title}</p>}
      {size === "l" && <p className={css.title_l}>{info.title}</p>}
    </div>
  );
}

export default inject("languageStore")(observer(PropsCard));
