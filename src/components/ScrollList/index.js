import classNames from "classnames";
import css from "./index.module.less";

function ScrollList(props) {
  const { className } = props;
  return (
    <div className={classNames(css.scrollList, className)}>
      {props.children}
    </div>
  );
}

export default ScrollList;
