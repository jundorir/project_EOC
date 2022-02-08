/**
 * 公会战-开战
 */
import classNames from "classnames";
import { useState, Fragment, useEffect } from "react";
import css from "./index.module.less";
import MembersModal from "../../Modal/MembersModal";
import Union from "../../Components/Uniontotem";
import { inject, observer } from "mobx-react";
import { getGuildInfo, getSignUp } from "@common/api";
function Fighting(props) {
  const {
    chain,
    userStore,
    showEnemy = true,
    showVS = true,
    showOwn = true,
    enemyData = {},
  } = props;
  // console.log("hhh", enemyData);
  const {
    unionbattleStore,
    unionStore: { unionInfo },
    headStore,
  } = userStore;
  const [showModal, setShowModal] = useState(false);
  function renderModal() {
    // console.log(showModal);
    if (showModal) {
      return (
        <MembersModal
          closeModal={() => {
            setShowModal(false);
          }}
          membersData={unionbattleStore.membersList}
        />
      );
    }
  }
  const [enemyIMG, setEnemyIMG] = useState("");
  const [enemyNum, setEnemyMember] = useState("");
  useEffect(async () => {
    const result = await getGuildInfo({
      user: chain.address,
      guild_id: enemyData.guild_id,
      sign: chain.token,
    });
    if (result) {
      setEnemyIMG(result.avatar_image);
    }
    const enemyMember = await getSignUp({
      user: chain.address,
      is_count: 1, //1==>返回人员总数
      sign: chain.token,
      guild_id: enemyData.guild_id,
    });
    if (enemyMember) {
      setEnemyMember(enemyMember);
    }
  }, [true]);
  return (
    <Fragment>
      {/* 攻击详情 */}
      <div className={css.middleCity}>
        <div className={css.city}>
          <div className={css.pk}>
            {showEnemy && (
              <div className={css.top}>
                <Union
                  url={headStore.data.unionArray[enemyIMG ? enemyIMG : 1]}
                />
                <div className={css.unionInfo}>
                  <span className={css.white}>守方：</span>
                  <span className={css.yellow}>{enemyData.guild_name}</span>
                </div>
                <div className={css.people}>
                  <span className={css.white}>已集结</span>&nbsp;&nbsp;
                  <span className={css.yellow}>{enemyNum}</span>&nbsp;&nbsp;
                  <span className={css.white}>人</span>
                </div>
                {/* <div className={css.none}>查看人员</div> */}
              </div>
            )}
            {showEnemy && <div className={css.middle}></div>}
            <div className={css.bottom}>
              <Union
                own={true}
                url={headStore.data.unionArray[unionInfo.avatar_image]}
              />
              <div className={css.unionInfo}>
                <span className={css.white}>我方：</span>
                <span className={css.yellow}>{unionInfo.name}</span>
              </div>
              <div className={css.people}>
                <span className={css.white}>已集结</span>&nbsp;&nbsp;
                <span className={css.yellow}>{unionbattleStore.assembled}</span>
                &nbsp;&nbsp;
                <span className={css.white}>人</span>
              </div>
              {unionbattleStore.assembled > 0 && (
                <div className={css.toView}>
                  查看人员
                  <div
                    className={css.toViewLayer}
                    onClick={() => {
                      setShowModal(true);
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
      {/* </div> */}
      <div
        className={css.layer}
        onClick={() => {
          props.goback();
        }}
      ></div>
    </Fragment>
  );
}

export default inject("chain", "userStore")(observer(Fighting));
