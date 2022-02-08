import { ProgressBar } from "antd-mobile";
import css from "./index.module.less";
function Progress(props) {
  const { percent } = props;

  return <ProgressBar percent={percent} className={css.progress} />;
}

export default Progress;
