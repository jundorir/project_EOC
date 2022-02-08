// 战役
import { Fragment, useEffect, useState } from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
function Explain(props) {
  const {
    languageStore: { language },
  } = props;
  // 首通奖励列表
  const [list, setList] = useState([]);
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        name: i + 10,
        text: i + "BTC",
      });
    }
    setList(arr);
  }, []);
  return (
    <div className={css.pageMain}>
      <div className={css.pageHeader}>{language.war_explanTitle}</div>
      <div className={css.pageCenter}>
        <div className={css.pageContent}>
          <div>1.{language.war_explan1}</div>
          <div>2.{language.war_explan2}</div>
          <div>3.{language.war_explan3}</div>
          <div>4.{language.war_explan4} </div>
          <div>5.{language.war_explan5}</div>
          <div>6.{language.war_explan6}</div>
        </div>
      </div>
    </div>
  );
}
export default inject("view", "languageStore")(observer(Explain));
