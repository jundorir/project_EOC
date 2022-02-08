import classNames from "classnames";
import { Fragment } from "react/cjs/react.production.min";
import css from "./index.module.less";
import Button from "../../Components/Button";
import Flag from "../../Components/Flag";

function HoldModal(props) {
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
        <div className={css.contain}>
          <Flag title={"成功占领"} city={"耶路撒冷"} union={"嗷嗷公会"} />
          <Button
            title={"完成"}
            onClick={() => {
              props.closeModal();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HoldModal;
