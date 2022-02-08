import { WrappedHeroCard } from "@components/Card/HeroCard";
import css from "./index.module.less";

function DisplayHeroModal(props) {
  const { hero, closeModal } = props;

  return (
    <div
      className={css.modal}
      onClick={() => {
        closeModal();
      }}
    >
      <div
        className={css.modalBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <WrappedHeroCard hero={hero} />
      </div>
    </div>
  );
}

export default DisplayHeroModal;
