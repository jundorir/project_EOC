import { useRef, useState, useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

function Resources(props) {
  const { chain, userStore } = props;
  const { pp_time } = userStore;
  const intervalRef = useRef(null);
  const [date, setDate] = useState({
    minutes: "00",
    seconds: "00",
  });
  useEffect(() => {
    if (pp_time - Date.now() <= 0) {
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
  }, [userStore.pp_time]);
  function computeDate() {
    const date = Date.now();
    // console.log("当前时间",date);
    const diffTime = new Date(pp_time).getTime() - date;
    if (diffTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      // console.log("当前倒计时结束", "刷新pp_time");
      const query = setInterval(async () => {
        const result = await userStore.queryUserInfo();
        if (result) {
          clearInterval(query);
        }
      }, 1000);
    }
    let minutes = ~~(diffTime / 60 / 1000);
    let seconds = ~~((diffTime / 1000) % 60);

    setDate({
      minutes: minutes.toString().padStart(2, 0),
      seconds: seconds.toString().padStart(2, 0),
    });
  }
  return (
    <div className={css.resources}>
      <div className={classNames(css.resource)}>
        <div className={css.left}>
          <div className={css.leftbg}>
            <div className={css.physicalIMG}></div>
          </div>
        </div>
        <div className={css.right}>
          <div className={css.number}>
            <span>{userStore.pp}&nbsp;&nbsp;/&nbsp;</span>
            <span className={css.total}>50</span>
          </div>
          <div className={css.cutdown}>
            {userStore.pp < 50 ? (
              <div className={css.timeRB}>
                <div>
                  {date.minutes}:{date.seconds}
                </div>
              </div>
            ) : (
              " "
            )}
          </div>
        </div>
        <div></div>
      </div>
      <div className={classNames(css.resource, css.topMargin)}>
        <div className={css.left}>
          <div className={css.leftbg}>
            <div className={css.HPIMG}></div>
          </div>
        </div>
        <div className={css.right}>
          <div className={css.number}>{userStore.GOLD}</div>
        </div>
      </div>
      <div className={classNames(css.resource, css.topMargin)}>
        <div className={css.left}>
          <div className={css.leftbg}>
            <div className={css.attackIMG}></div>
          </div>
        </div>
        <div className={css.right}>
          <div className={css.number}>{userStore.MMR}</div>
        </div>
      </div>
      <div className={classNames(css.resource, css.topMargin)}>
        <div className={css.left}>
          <div className={css.leftbg}>
            <div className={css.powerIMG}></div>
          </div>
        </div>
        <div className={css.right}>
          <div className={css.number}>{userStore.USDT}</div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "userStore")(observer(Resources));
