import UnionMember from "@components/UnionMember";
import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";

function MemberList(props) {
  const {
    data = [],
    num = 0,
    total = 0,
    languageStore: { language },
  } = props;
  const positionData = {
    2: language.Chairman,
    1: language.member,
    0: language.member,
  };
  function renderItem(item, index) {
    return (
      <li key={index} className={css.member_item}>
        <UnionMember
          data={{
            avatar: item.head,
            name: item.nickname || item.user,
            bp: item.power,
            position: positionData[item.position],
          }}
        />
      </li>
    );
  }
  return (
    <div className={css.body}>
      <p className={css.title}>
        <span>{language.Member_Limit}</span>
        <span>
          {num}/{total}
        </span>
      </p>
      <ul className={css.member_list}>
        {data.map((item, index) => renderItem(item, index))}
      </ul>
    </div>
  );
}
export default inject(
  "chain",
  "userStore",
  "languageStore"
)(observer(MemberList));
