import classNames from "classnames";
import { Fragment } from "react/cjs/react.production.min";
import css from "./index.module.less";
import Button from "../../Components/Button";
import Flag from "../../Components/Flag";

function VictoryModal(props) {
  console.log(props);
  const { data = "", unionname = "" } = props;
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
          <Flag title={props.title} city={data} union={unionname} />
          <div className={css.center}></div>
          <Button
            children={"完成"}
            onClick={() => {
              props.closeModal();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default VictoryModal;
