import { Fragment } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import GeneralModal from "@components/Modal/GeneralModal";

function Avatar(props) {
  const {
    chain,
    view,
    userStore,
    languageStore: { language },
  } = props;
  function changeView(item, name) {
    view.changeDisplayView(item, name);
  }
  return (
    <div className={css.contain}>
      <div className={css.left}>
        <div
          className={css.item}
          onClick={() => {
            changeView("union", language.Guild);
          }}
        >
          <div className={classNames(css.itemIMG, css.union)}></div>
          <div className={css.word}>{language.Guild}</div>
        </div>
        <div
          className={css.item}
          onClick={() => {
            GeneralModal.alert({
              title: language.coming_soon,
              content: language.feature_coming_soon,
            });
            // changeView("hireHero",language.Hire);
          }}
        >
          <div className={classNames(css.itemIMG, css.hireHero)}></div>
          <div className={css.word}>{language.Hire}</div>
        </div>
        <div
          className={css.item}
          // onClick={() => {
          //   Toast.show({
          //     icon: "loading",
          //     content: `即将上线`,
          //     duration: 1000,
          //   });
          // }}
          onClick={() => {
            view.changeDisplayView("market", language.Market);
          }}
        >
          <div className={classNames(css.itemIMG, css.market)}></div>
          <div className={css.word}>{language.Market}</div>
        </div>
      </div>
      <div className={css.middle}>
        <div
          className={css.item}
          onClick={() => {
            changeView("warehouse", language.Depot);
          }}
        >
          <div className={classNames(css.itemIMG, css.warehouse)}></div>
          <div className={css.word}>{language.Depot}</div>
        </div>
        <div
          className={css.item}
          onClick={() => {
            changeView("tavern", language.Tavern);
          }}
        >
          <div className={classNames(css.itemIMG, css.pub)}></div>
          <div className={css.word}>{language.Tavern}</div>
        </div>
        <div
          className={css.item}
          onClick={() => {
            // GeneralModal.alert({
            //   title: language.coming_soon,
            //   content: language.feature_coming_soon,
            // });
            if (userStore.guild_id > 0) {
              changeView("unionBattle", language.Guild_Wars);
            } else {
              GeneralModal.alert({
                title: language.tip,
                content: language.join_first,
              });
            }
          }}
        >
          <div className={classNames(css.itemIMG, css.unionWar)}></div>
          <div className={css.word}>{language.Guild_Wars}</div>
        </div>
      </div>
      <div className={css.right}>
        <div
          className={css.item}
          onClick={() => {
            changeView("production", language.Produce);
          }}
        >
          <div className={classNames(css.itemIMG, css.production)}></div>
          <div className={css.word}>{language.Produce}</div>
        </div>
        <div
          className={css.item}
          onClick={() => {
            changeView("hero", language.Hero);
          }}
        >
          <div className={classNames(css.itemIMG, css.hero)}></div>
          <div className={css.word}>{language.Hero}</div>
        </div>
        <div
          className={css.item}
          onClick={() => {
            changeView("battle", language.War);
          }}
        >
          <div className={classNames(css.itemIMG, css.battle)}></div>
          <div className={css.word}>{language.War}</div>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "chain",
  "view",
  "userStore",
  "languageStore"
)(observer(Avatar));
