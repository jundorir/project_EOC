// 首页
import { Popover } from "antd-mobile";
import css from "./index.module.less";

import dropBtn from "@assets/images/market/dropBtn.png";

const defaulMenuList = [
  //新增价格排序
  { text: "价格升序", value: "price_up" },
  { text: "价格降序", value: "price_down" },
  { text: "战斗力升序", value: "power_up" },
  { text: "战斗力降序", value: "power_down" },
];

/**
 * label 设定标示
 * value 设定表示值
 * menuList 下拉列表
 * setValue 设定排序，传递至外部组件
 * id 必传字段
 * 本组件无高度无背景，须外部包裹一个盒子设定
 */
const DropSelect = ({
  label = "排序",
  value = "power",
  menuList = defaulMenuList,
  setValue,
  id,
}) => {
  return (
    <div className={css.DropSelect} id={id}>
      <div>
        <span className={css.label}>{label}:</span>
        <span className={css.value}>
          {menuList.find((el) => el.value === value).text}
        </span>
      </div>
      <Popover.Menu
        actions={menuList}
        onAction={(node) => setValue(node.value)}
        getContainer={() => document.getElementById(id)}
        placement="bottomRight"
        trigger="click"
      >
        <img className={css.dropBtn} src={dropBtn} />
      </Popover.Menu>
    </div>
  );
};

export default DropSelect;
