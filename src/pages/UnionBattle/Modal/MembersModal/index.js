import classNames from "classnames";
import css from "./index.module.less";
import Button from "../../Components/Button";
import UnionMember from "@components/UnionMember";
import IMG from "@assets/images/home/operationList_card.png";
import { inject, observer } from "mobx-react";

function MembersModal(props) {
  const {
    userStore,
    chain,
    languageStore: { language },
    membersData = [],
  } = props;
  const positionData = {
    2: language.Chairman,
    1: language.member,
    0: language.member,
  };
  function renderItem() {
    return membersData.map((item) => {
      return (
        <div className={css.item} key={item.id}>
          <UnionMember
            data={{
              avatar: item.head,
              name: item.nickname || item.user,
              bp: item.power,
              position: positionData[item.position],
            }}
          />
        </div>
      );
    });
  }
  return (
    <div
      className={css.modalBG}
      onClick={() => {
        props.closeModal();
      }}
    >
      <div
        className={css.modalBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.title}>{language.war_members}</div>
        <div className={css.details}>
          <div className={css.contain}>
            <div className={css.inner}>{renderItem()}</div>
          </div>
        </div>
        <Button
          children={language.OK}
          onClick={() => {
            props.closeModal();
          }}
        />
      </div>
    </div>
  );
}

export default inject(
  "view",
  "userStore",
  "chain",
  "languageStore"
)(observer(MembersModal));
