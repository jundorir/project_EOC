/**
 * 顶部倒计时
 * @returns
 */
import css from "./index.module.less";
import { useRef, useState, useEffect, Fragment } from "react";

function Countdown(props) {
  const { guild_fight_time, guild_fight } = props;
  const [date, setDate] = useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
  const intervalRef = useRef(null);
  useEffect(() => {
    if (guild_fight_time * 1000 - Date.now() <= 0) {
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
  }, []);
  function computeDate() {
    const date = Date.now();
    const diffTime = guild_fight_time * 1000 - date;
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
  return (
    <div className={css.countdown}>
      {guild_fight > 0 ? (
        <Fragment>
          <div className={css.title}>{props.title}</div>
          <div className={css.time}>
            {date.hour - 0 > 0 && (
              <>
                <span className={css.number}>{date.hour}</span>
                <span className={css.unit}>时</span>
              </>
            )}
            <span className={css.number}>{date.minutes}</span>
            <span className={css.unit}>分</span>
            {date.hour - 0 <= 0 && (
              <>
                <span className={css.number}>{date.seconds}</span>
                <span className={css.unit}>秒</span>
              </>
            )}
          </div>
        </Fragment>
      ) : (
        <div className={css.going}>工会战进行中</div>
      )}
    </div>
  );
}
export default Countdown;
