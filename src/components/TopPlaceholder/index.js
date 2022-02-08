import classNames from "classnames";
import css from "./index.module.less";
function TopPlaceholder(props) {
  return (
    <div className={classNames(css.placeholder, props.className)}>
      {props.children}
    </div>
  );
}

export default TopPlaceholder;
