// 首页
import { inject, observer } from "mobx-react";
import { Selector, Popover } from "antd-mobile";
import css from "./index.module.less";

import selectClass_icon from "@assets/images/hire/selectClass_icon.png";

/**
 * rare 默认稀有度
 * setRare 设定稀有度，传递至外部组件
 * setOrder 设定排序，传递至外部组件
 * 本组件无高度无背景，须外部包裹一个盒子设定
 */
const HeroSelector = ({
  rare = "ALL",
  setRare,
  setOrder,
  hasOrder = true,
  languageStore,
}) => {
  const { language } = languageStore;
  const LevelList = [
    {
      label: language.All,
      value: "ALL",
    },
    {
      label: "UR",
      value: "UR",
    },
    {
      label: "SSR",
      value: "SSR",
    },
    {
      label: "SR",
      value: "SR",
    },
    {
      label: "R",
      value: "R",
    },
    {
      label: "N",
      value: "N",
    },
  ];
  const MenuList = [
    { text: language.Rarity, order: "rarity" },
    { text: language.Star, order: "starLv" },
    { text: language.Level, order: "Lv" },
  ];
  return (
    <div className={css.HeroSelector} id="HeroSelector">
      <Selector
        options={LevelList}
        value={[rare]}
        onChange={(v) => {
          // 避免取消选择
          if (v.length) {
            setRare(v[0]);
          }
        }}
      />
      {hasOrder && (
        <Popover.Menu
          actions={MenuList}
          onAction={(node) => setOrder(node.order)}
          getContainer={() => document.getElementById("HeroSelector")}
          placement="bottomLeft"
          trigger="click"
        >
          <img className={css.SelectorClass} src={selectClass_icon} />
        </Popover.Menu>
      )}
    </div>
  );
};

export default inject("languageStore")(observer(HeroSelector));
