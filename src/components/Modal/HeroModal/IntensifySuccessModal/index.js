import Button from "@components/Button";
import { WrappedHeroCard } from "@components/Card/HeroCard";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";

function IntensifySuccessModal(props) {
  const {
    languageStore: { language },
    hero,
    closeModal,
    title = language.hero_synthesis_success,
  } = props;

  return (
    <div
      className={css.modal}
      onClick={() => {
        closeModal();
      }}
    >
      <div className={css.modalBox}>
        <div className={css.light}></div>
        <div className={css.title}>{title}</div>
        <div
          className={css.hero}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <WrappedHeroCard
            hero={hero}
            style={{
              transform: "scale(.85)",
              transformOrigin: "left top",
            }}
          />
        </div>
        <div className={css.tips}>
          {/* {language.hero_Rising_star_other_destory} */}
        </div>
        <Button
          onClick={() => {
            closeModal();
          }}
        >
          {language.complete}
        </Button>
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(IntensifySuccessModal));
