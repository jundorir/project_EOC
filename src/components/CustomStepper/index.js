// 首页
import { Stepper } from "antd-mobile";

import css from "./index.module.less";

const CustomStepper = ({
  value,
  onChange,
  digits,
  min = 0,
  step = 100,
  max,
}) => {
  return (
    <Stepper
      step={step}
      min={min}
      max={max}
      digits={digits}
      className={css.CustomStepper}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomStepper;
