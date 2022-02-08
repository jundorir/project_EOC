// 战役
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import css from "./index.module.less";
import { RewardIcon } from "../List";
import classNames from "classnames";
import HeroCard from "@components/Card/HeroCard";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import fight from "@utils/fightV2";
import AudioFightBg from "@assets/audio/fight_bg.mp3"
import AudioFightAttack from "@assets/audio/battle_hero_pk.mp3"
import attacked_hero from "@assets/images/battle/attacked_hero.png";
import { inject, observer } from "mobx-react";

// const AudioFightBg =
//   "https://media.eocryptoken.com:90/static/media/fight_bg.ac77ad09.mp3";
// const AudioFightAttack =
//   "https://media.eocryptoken.com:90/static/media/battle_hero_pk.ff56561d.mp3";

let bgAudio = new Howl({
  src: [AudioFightBg],
});
let pkAudio = new Howl({
  src: [AudioFightAttack],
});
function Modal(props) {
  const {
    visible,
    callback,
    blueVictory = false,
    fightData = false,
    bossData = {},
    userStore,
    languageStore,
  } = props;
  const { power, pp, pp_time, round_id, heroStore } = userStore;
  const [battleHeroList, setBattleHeroList] = useState([
    ...heroStore.battleHeroFormation,
  ]);
  const [heroList, setHeroList] = useState([]);
  const blueHeroEl = useRef(null);
  const redHeroEl = useRef(null);

  const [showInit, setShowInit] = useState(false);
  const [fightHero, setFightHero] = useState([]);

  const [showBossPk, setShowBossPk] = useState(false);
  const [heroDefeated, setHeroDefeated] = useState(false);
  const [bossDie, setBossDie] = useState(false);
  const [bossAttacked, setBossAttacked] = useState(false);
  // console.log('bossData', bossData)
  useEffect(() => {
    // if(battleHeroList.map())
    setHeroList(battleHeroList.filter((item) => item != null));
  }, [battleHeroList]);
  useEffect(() => {
    bgAudio.play();
    let img = new Image();
    img.src = attacked_hero;
    return () => {
      bgAudio.stop();
      fight.destroy();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowInit(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (blueHeroEl.current && showInit) {
      let children = blueHeroEl.current.children;
      fight.init({
        clientWidth: document.querySelector('#app').clientWidth,
        children,
        bossAttacked: (status) => {
          if (status) {
            pkAudio.play();
          } else {
            pkAudio.stop();
          }
          // console.log('bossAttacked status', status)
          setBossAttacked(status);
        },
        overCallback: () => {
          // !blueVictory
          if (!fightData) {
            setShowBossPk(true);
            setTimeout(() => {
              setHeroDefeated(true);
              setTimeout(() => {
                callback(0);
              }, 500);
            }, 500);
          } else {
            setBossDie(true);
            setTimeout(() => {
              callback(1);
            }, 500);
          }
          bgAudio.stop();
        },
      });
    }
  }, [blueHeroEl, showInit]);
  if (!visible) {
    return null;
  }
  return (
    <div className={css.fighting}>
      <div className={css.middle}>
        <div className={css.top}></div>
        <div className={classNames(css.main, showInit ? css.mainShow : "")}>
          <div className={css.bossHero} ref={redHeroEl}>
            <div
              className={classNames(
                css.heroItem,
                bossDie ? css.bossDefeated : ""
              )}
            >
              <HeroCard
                hero={{
                  ...heroStore.createBaseHero(bossData.id, Date.now()),
                  power: bossData.basepower,
                  Lv: "",
                  atk: "",
                  def: "",
                }}
                style={{ transform: "scale(.58)", transformOrigin: "left top" }}
              />

              <div
                className={css.bossBgAnimation}
                style={{ display: bossAttacked ? "block" : "none" }}
              />
            </div>
          </div>
          <div className={css.myHero} ref={blueHeroEl}>
            {heroList.map((item, index) => (
              <div
                key={index}
                className={classNames(
                  css.heroItem,
                  heroDefeated ? css.heroDefeated : ""
                )}
              >
                <div className={classNames(css.heroItemScale)}>
                  <HeroThumbnail hero={item} titleEllipsis={true} />
                </div>
                {showBossPk && !heroDefeated ? (
                  <div className={css.heroBgAnimation} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className={css.bottom}>
          <div className={css.route}>
            {languageStore.language.battle_battle_ing}...
          </div>
          <div
            className={css.back}
            onClick={() => {
              bgAudio.stop();
              if (fightData) {
                callback(1);
              } else {
                callback(0);
              }
            }}
          >
            {languageStore.language.battle_skip}
          </div>
        </div>
      </div>
    </div>
  );
}
export default inject("view", "userStore", "languageStore")(observer(Modal));
