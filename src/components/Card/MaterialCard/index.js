// 材料卡片
import useMaterial from "@common/const/define/Material";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
function MaterialCard(props) {
  const {
    materialKey,
    quantity = null,
    onClick,
    languageStore: { language },
  } = props;
  const Material = useMaterial(language);
  const info = Material[materialKey];
  return (
    <div
      className={css.material}
      onClick={() => {
        onClick?.();
      }}
    >
      <img src={info.images} alt="" className={css.images} />
      {!!quantity && <div className={css.quantity}>{quantity}</div>}
      <div className={css.title}>{info.title}</div>
    </div>
  );
}

export default inject("languageStore")(observer(MaterialCard));
