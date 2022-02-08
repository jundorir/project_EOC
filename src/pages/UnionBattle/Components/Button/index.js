/**
 * 红色按钮
 * @returns
 */
import css from "./index.module.less";

function Button(props) {
  return (
    <div
      className={css.button}
      onClick={props.disabled ? () => {} : props.onClick}
      style={{ color: props.color === "white" && "white" }}
      disabled={props.disabled}
    >
      {props.children}
      <div className={css.layer}></div>
    </div>
  );
}
export default Button;
