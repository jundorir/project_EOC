import classNames from "classnames";
import css from "./index.module.less";

function ResourceItem(props) {
  const { type, number, className } = props;
  return (
    <div className={classNames(css.resource, className)}>
      <div className={css.left}>
        <div className={css[type]}></div>
      </div>
      <div className={css.right}>{number} </div>
    </div>
  );
}

export default ResourceItem;

