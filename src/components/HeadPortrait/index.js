import css from "./index.module.less";

function HeadPortrait(props) {
  return (
    <div
      className={css.avatar}
      onClick={() => {
        props.onClick();
      }}
    >
      <div className={css.photo}>
        <img src={props.IMG} className={css.img} alt="头像" />
      </div>
    </div>
  );
}

export default HeadPortrait;
