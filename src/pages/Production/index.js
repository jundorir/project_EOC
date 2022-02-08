import Button from "@components/Button";
import GeneralModal from "@components/Modal/GeneralModal";
import PageContainer from "@components/PageContainer";
import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import css from "./index.module.less";
import { Toast } from "antd-mobile";
import classNames from "classnames";
import ReclaimTenModal from "./ReclaimTenModal";
import Infolist from "./Infolist";
import { baseCoin } from "@common/const/define/hero";
import ScrollNumber from "@components/ScrollNumber";

function ProductionIndex(props) {
  const [showReclainmModal, setShowReclainmModal] = useState(false);
  const {
    view,
    userStore,
    languageStore: { language },
  } = props;
  const { productionStore, materialStore } = userStore;
  const { nowhave, totalOutput, unclaimed } = productionStore;
  const canOpenLandMax =
    ~~(userStore.round_id / 10) - (productionStore.nowhave - 1);
  // ~~(1000 / 10) - (productionStore.nowhave - 1);

  useEffect(() => {
    productionStore.getProductionDatas();
    const timer = setInterval(() => {
      productionStore.getProductionDatas();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 领取奖励
  async function getAwardHandle() {
    if (waitGet === "0.00") {
      GeneralModal.alert({
        content: "没有可领取的金币!",
      });
      return;
    }
    const result = await productionStore.withDrawAsync();
    if (result) {
      GeneralModal.alert({
        content: language.get_award_success,
      });
      await productionStore.getProductionDatas();
      await userStore.queryAllBalance();
    } else {
      Toast.show({
        icon: "fail",
        content: language.get_award_fial,
        duration: 500,
      });
    }
  }

  async function authorizationHandle() {
    const result = await userStore.toApprove("MMR");
    if (result) {
      userStore.queryAllowance("MMR"); //重新查询授权
    }
  }

  // 开启农田系统
  async function openFarm() {
    if (materialStore.EmpireHoeToken - 0 === 0) {
      GeneralModal.alert({
        title: language.open_fail,
        content: `${language.hoe} 0`,
      });
      return;
    }
    GeneralModal.confirm({
      footer: null,
      content: (
        <>
          <div>{language.open_farm_title}</div>
          <div>
            {language.hoe_number}：{materialStore.EmpireHoeToken}
          </div>
        </>
      ),
      onConfirm: async () => {
        const result = await productionStore.openFarmAsync();
        if (result) {
          materialStore.queryMaterialNumber("EmpireHoeToken");
          GeneralModal.alert({
            title: language.tip,
            content: language.open_success,
          });
          productionStore.getProductionDatas();
        } else {
          Toast.show({
            icon: "fail",
            content: language.open_fail,
            duration: 500,
          });
        }
      },
    });
  }

  // 开垦多次
  async function reclaimTenHandle(amount) {
    const info = await productionStore.signAddLand(amount);
    if (!info) {
      // todo 服务器返回数据异常
      return;
    }

    const result = await productionStore.addFarmAsync(
      info.land_numHex,
      info.user_roundHex,
      info.idx,
      info.sign
    );
    if (result) {
      userStore.queryAllBalance();
      productionStore.getProductionDatas();
      setShowReclainmModal(false);
      GeneralModal.alert({
        title: language.reclaim_success,
        content: (
          <>
            <p className={css.cell}>
              <span>{language.success_reclaim}</span>
              <span>
                {amount}
                {language.famland_unit}
              </span>
            </p>
            <p className={css.cell}>
              <span>{language.dialy_adding} </span>
              <span>{amount * baseCoin}EOCC</span>
            </p>
          </>
        ),
      });
    } else {
      Toast.show({
        icon: "fail",
        content: language.reclaim_fail,
        duration: 500,
      });
    }
  }

  const haveNoFarm = productionStore.nowhave === "0";

  const waitGet = (
    (baseCoin * nowhave + baseCoin * totalOutput) *
    (1 + (userStore.unionStore.unionInfo.bonus || 0) / 100)
  ).toFixed(0); // 待领取

  return (
    <PageContainer className={classNames(css.container)}>
      <div className={classNames(css.body, { [css.body_nofarm]: haveNoFarm })}>
        {!haveNoFarm && (
          <>
            <Infolist />
            <div className={css.right_info}>
              <li
                className={classNames(css.number_cell, css.number_cell__right)}
              >
                <span>{userStore.GOLD}</span>
                <img
                  src={require("@assets/images/production/coin.png").default}
                  alt=""
                />
              </li>
              <li
                className={classNames(css.number_cell, css.number_cell__right)}
              >
                <span>{userStore.MMR}</span>
                <img
                  src={require("@assets/images/production/mmr.png").default}
                  alt=""
                />
              </li>
              <div
                onClick={() => {
                  GeneralModal.alert({
                    title: language.tip,
                    content: (
                      <p>
                        {language.production_addtion_explain_1}
                        <br />
                        {language.production_addtion_explain_2}
                      </p>
                    ),
                  });
                }}
                className={classNames(css.explain)}
              >
                <img
                  src={require("@assets/images/production/explain.png").default}
                  alt=""
                />
                <span>{language.production_explain}</span>
              </div>
            </div>
          </>
        )}

        <div className={css.footer}>
          {haveNoFarm ? (
            <>
              <div className={css.open}>{language.no_open_farm}</div>
              <div className={css.actions}>
                <Button onClick={openFarm}>{language.open_farm_sys}</Button>
              </div>
              <p>{language.consume_hoe}</p>
              <p>{language.hoe_from_where}</p>
            </>
          ) : (
            <>
              <div className={css.pop_contaienr}>
                <div onClick={getAwardHandle} className={css.pop_center}>
                  <div className={css.pop_coin}>
                    <ScrollNumber.Group value={Number(unclaimed).toFixed(2)} />
                  </div>
                  <button>{language.get}</button>
                </div>
                <div className={classNames(css.pop, css.pop1)}></div>
                <div className={classNames(css.pop, css.pop2)}></div>
              </div>
              <div className={css.actions}>
                <Button
                  onClick={() =>
                    view.changeDisplayView("dispatch", language.dispatch)
                  }
                >
                  {language.dispatch}
                </Button>
                <Button
                  disabled={canOpenLandMax === 0}
                  onClick={() => setShowReclainmModal(true)}
                >
                  {language.reclaim}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReclaimTenModal
        visible={showReclainmModal}
        canOpenLandMax={canOpenLandMax}
        onAuthorization={authorizationHandle}
        authCount={userStore.MMR_APPROVEMENT}
        MMR_balance={userStore.MMR}
        onConfirm={reclaimTenHandle}
        onCancel={() => setShowReclainmModal(false)}
      />
    </PageContainer>
  );
}

export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(ProductionIndex));
