import classNames from "classnames";
import css from "./index.module.less";
import Button from "@components/Button";

function InvitationModal(props) {
  function renderItem() {
    const datas = [
      // {
      //   id: 1,
      //   address: "03h...4h123131k",
      //   number: "100000.0000",
      //   time: "2021-12-21 15：23",
      // },
    ];
    return datas.map((item) => {
      return (
        <div className={css.item} key={item.id}>
          <div className={css.left}>
            <div className={css.white}>
              {props.id === 1 ? "地址：" : "来源"}
            </div>
            <div
              className={classNames(
                css.yellow,
                props.id === 2 && css.noneRight
              )}
            >
              {item.address}
            </div>
          </div>
          {props.id === 2 && (
            <div className={css.middle}>
              <div className={css.white}>金额：</div>
              <div className={classNames(css.yellow, css.money)}>
                {item.number}
              </div>
            </div>
          )}
          <div className={css.right}>
            <div className={css.white}>
              {props.id === 1 ? "时间：" : "注册时间："}
            </div>
            <div
              className={classNames(
                css.yellow,
                props.id === 2 && css.noneRight
              )}
            >
              {item.time}
            </div>
          </div>
        </div>
      );
    });
    // return <Fragment>1234</Fragment>;
  }
  return (
    <div
      className={css.modalBG}
      onClick={() => {
        props.closeModal();
      }}
    >
      <div
        className={css.modalBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.title}>{props.title}</div>
        <div className={css.details}>
          <div className={css.contain}>
            <div className={css.inner}>{renderItem()}</div>
          </div>
        </div>
        <Button
          children={"确定"}
          onClick={() => {
            props.closeModal();
          }}
        />
      </div>
    </div>
  );
}

export default InvitationModal;
