import { Fragment, useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import IMG from "@assets/images/home/operationList_card.png";
import HeadPortrait from "@components/HeadPortrait";

function Avatar(props) {
  const { chain, view, userStore } = props;
  const { headStore } = userStore;
  return (
    <Fragment>
      <div>
        <HeadPortrait
          IMG={
            headStore.data.headArray[userStore.head_id] ||
            headStore.data.none[0]
          }
          onClick={() => {
            props.profil("myProfile");
          }}
        />
        <div
          className={css.IDNumber}
          onClick={() => {
            // view.changeDisplayView("login");
          }}
        >
          {chain.quiteAddress}
        </div>
      </div>
    </Fragment>
  );
}

export default inject("view", "userStore", "chain")(observer(Avatar));
