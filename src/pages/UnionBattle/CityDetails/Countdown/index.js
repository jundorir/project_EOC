/**
 * 顶部倒计时
 * @returns
 */
import css from "./index.module.less";
import { useRef, useState, useEffect } from "react";
import { inject, observer } from "mobx-react";

function Countdown(props) {
  const { chain, userStore } = props;
  const { unionbattleStore } = userStore;
  const { fight_time, guild_type } = unionbattleStore;
  const [date, setDate] = useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
  const intervalRef = useRef(null);
  useEffect(() => {
    if (fight_time * 1000 - Date.now() <= 0) {
      return null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    computeDate();
    intervalRef.current = setInterval(() => {
      computeDate();
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [fight_time]);
  // console.log("fight_time", fight_time);
  function computeDate() {
    const date = Date.now();
    const diffTime = fight_time * 1000 - date;
    if (diffTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    let hour = ~~(diffTime / 1000 / 60 / 60);
    let minutes = ~~((diffTime / 1000 / 60) % 60);
    let seconds = ~~((diffTime / 1000) % 60);

    setDate({
      hour: hour.toString(),
      minutes: minutes.toString().padStart(2, 0),
      seconds: seconds.toString().padStart(2, 0),
    });
  }
  function renderTime() {
    if (guild_type - -1 === 0 || guild_type - 0 === 0) return;
    return (
      <div className={css.time}>
        <span className={css.number}>{date.hour}</span>
        <span className={css.unit}>时</span>
        <span className={css.number}>{date.minutes}</span>
        <span className={css.unit}>分</span>
        {date.hour - 0 <= 0 && fight_time * 1000 - Date.now() > 0 && (
          <>
            <span className={css.number}>{date.seconds}</span>
            <span className={css.unit}>秒</span>
          </>
        )}
      </div>
    );
  }
  return (
    <div className={css.countdown}>
      <div className={css.title}>{props.title}</div>
      {renderTime()}
    </div>
  );
}
export default inject("chain", "userStore", "view")(observer(Countdown));
