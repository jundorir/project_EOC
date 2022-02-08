import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";

function UnionMember(props) {
  const { data = {}, userStore } = props;
  const { headStore } = userStore;
  return (
    <div className={css.member_container}>
      <div className={css.avatar}>
        <div className={css.photo}>
          <img
            src={
              data.avatar >= 0 && data.avatar < 12
                ? headStore.data.headArray[data.avatar]
                : headStore.data.none[0]
            }
            alt=""
          />
        </div>
      </div>
      <div className={css.info}>
        <div className={css.name}>{data.name}</div>
        <div className={css.bp}>BP:{data.bp}</div>
      </div>
      <div className={css.position}>{data.position}</div>
    </div>
  );
}
export default inject("view", "userStore", "chain")(observer(UnionMember));
