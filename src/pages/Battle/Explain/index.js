// 战役
import {Fragment, useEffect, useState} from "react";
import Button from "@components/Button";
import css from "./index.module.less";
import {inject, observer} from "mobx-react";
const LIST = [
  {title: '200', val: '1FIL'},
  {title: '300', val: '1BNB'},
  {title: '400', val: '1.5BNB'},
  {title: '500', val: '0.2ETH'},
  {title: '600', val: '0.3ETH'},
  {title: '700', val: '0.5ETH'},
  {title: '800', val: '0.6ETH'},
  {title: '900', val: '0.7ETH'},
  {title: '1000', val: '1ETH'},
  {title: '1100', val: '0.1BTC'},
  {title: '1200', val: '0.15BTC'},
  {title: '1300', val: '0.21BTC'},
  {title: '1400', val: '0.27BTC'},
  {title: '1500', val: '0.33BTC'},
  {title: '1600', val: '0.4BTC'},
  {title: '1700', val: '0.46BTC'},
  {title: '1800', val: '0.51BTC'},
  {title: '1900', val: '0.57BTC'},
  {title: '2000', val: '10BTC'},
]
function BattleExplain(props) {
  const { languageStore } = props
  // 首通奖励列表
  const [list, setList] = useState([])
  useEffect(()=> {
    let arr = []
    for(let i = 0 ; i < 20; i++) {
      arr.push({
        name: i + 10,
        text: i + 'BTC'
      })
    }
    setList(arr)
  }, [])
  return (
    <div className={css.pageMain}>
      <div className={css.pageHeader}>{languageStore.language.battle_battle_explain}</div>
      <div className={css.pageContent}>
        <div className={css.pageContentTit}>{languageStore.language.battle_battle_rank_desc} <br />{languageStore.language.battle_battle_rank_desc_after}</div>
        <div className={css.pageContentBox}>
          <div className={css.boxHeader}>
            <BattleExplainList>
              <label className={css.boxHeaderText}>{languageStore.language.battle_battle_rank}</label>
              <label className={css.boxHeaderText}>{languageStore.language.battle_global_first}</label>
            </BattleExplainList>
          </div>
          <div className={css.boxList}>
            <div className={css.boxListScroll}>
              {LIST.map((item, index)=>(
                <BattleExplainList>
                  <label className={css.boxListTit}>{item.title}</label>
                  <label className={css.boxListText}>{item.val}</label>
                </BattleExplainList>
              ))}
            </div>

          </div>
        </div>
      </div>
      <div className={css.pageFooter}>

      </div>

    </div>
  );
}
function BattleExplainList(props) {
  return (
    <div className={css.listFlex}>
      {props.children.map((item, index)=>(
        <div >{item}</div>
      ))}
    </div>
  )
}
export default inject("view", "languageStore")(observer(BattleExplain));

