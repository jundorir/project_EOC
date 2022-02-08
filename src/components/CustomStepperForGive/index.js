// 首页
import { Stepper } from "antd-mobile";

import css from "./index.module.less";

const CustomStepperForGive = ({ value, onChange, digits, min = 0, step = 100 }) => {
  return (
    <Stepper
      step={step}
      min={min}
      digits={digits}
      className={css.CustomStepperForGive}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomStepperForGive;
