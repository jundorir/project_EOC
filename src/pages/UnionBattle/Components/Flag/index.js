/**
 * 红色背景旗帜
 * @returns
 */
import css from "./index.module.less";

function Flag(props) {
  return (
    <div className={css.flag} onClick={props.onClick}>
      <div className={css.title}>{props.title}</div>
      <div className={css.city}>{props.city}</div>
      <div className={css.union}>
        <span className={css.white}>由</span>
        <span className={css.yellow}>
          &nbsp;&nbsp;{props.union}&nbsp;&nbsp;
        </span>
        <span className={css.white}>占领</span>
      </div>
    </div>
  );
}
export default Flag;
