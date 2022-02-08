/**
 * 公会图腾
 * @returns
 */
import css from "./index.module.less";
import classNames from "classnames";

function Union(props) {
  return (
    <div
      className={classNames(
        css.IMG,
        props.className,
        props.union === "other" && css.IMGOther
      )}
    >
      <div className={css.IMGBG}>
        <img src={props.url} className={css.img} alt="公会图腾" />
      </div>
    </div>
  );
}
export default Union;
