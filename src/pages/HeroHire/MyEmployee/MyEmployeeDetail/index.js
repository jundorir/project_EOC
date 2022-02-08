// 首页
import { useState, useRef, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { sec_to_time } from "@utils/common";

import WrappedHeroCard from "@components/Card/HeroCard";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import BottomPlaceholder from "@components/BottomPlaceholder";
import Seperate from "@components/Seperate";

import css from "./index.module.less";
import Button from "@components/Button";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取
const initDetail = {
  id: "1",
  productGold: 2000,
  sure: 2000,
  deadline: Date.now()+50000,
  promiseGold: 2000,
  status: 1, //0-已结束，1-雇佣中
  hero: {},
  isFinish: true,
  shareGold: 111,
  shareUSDT: 111,
};
const MyEmployeeDetail = (props) => {
  const { view } = props;
  const [heroModal, setHeroModal] = useState(null);
  const intervalRef = useRef(null);
  const [heroDetail, setHeroDetail] = useState(initDetail);
  const [rest, setRest] = useState(1);
  const [heroStatus, setHeroStatus] = useState(initDetail.status);

  function renderModal() {
    if (heroModal === "sendBack") {
      return (
        <MessageModal
          closeModal={() => {
            setHeroModal(null);
            view.goBack();
          }}
          title="雇佣结束"
        >
          <div className={css.empContent}>
            <p className={css.empFinish}>
              {heroDetail.isFinish ? "产量已达成" : "产量未达成"}
            </p>
            <p>
              <span>雇佣时长</span>

              <span>24小时</span>
            </p>
            <p>
              <span>保证金</span>

              <span>{heroDetail.sure}USDT</span>
            </p>
            <p>
              <span>需保证产量</span>

              <span>{heroDetail.promiseGold}EOCC</span>
            </p>
            <p>
              <span>达成产量</span>

              <span>{heroDetail.productGold}EOCC</span>
            </p>
            <p>
              <span>产成分红</span>

              <span>{heroDetail.shareGold}EOCC</span>
            </p>
            {heroDetail.isFinish && (
              <p>
                <span>保证金分红</span>

                <span>{heroDetail.shareUSDT}EOCC</span>
              </p>
            )}
          </div>
        </MessageModal>
      );
    }

    return null;
  }
  useEffect(() => {
    if (heroDetail.deadline - Date.now() <= 0) {
      setHeroStatus(0);
      return null;
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
    let date = Date.now();
    let diffTime = heroDetail.deadline - date;
    if (diffTime <= 0 && intervalRef.current) {
      setHeroStatus(0);
      clearInterval(intervalRef.current);
    }
    setRest(diffTime);
  }
  return (
    <div className={css.MyEmployeeDetail}>
      <div className={css.CardBox}>
        <WrappedHeroCard
          hero={heroDetail.hero}
          style={{
            transform: "scale(.75)",
            transformOrigin: "left top",
          }}
        />
      </div>
      <div className={css.DetailContent}>
        <p className={css.status}>{heroStatus === 1 ? "雇佣中" : "已结束"}</p>
        <p>
          <span>
            <Seperate>需保证产量</Seperate>
          </span>
          <span>:</span>
          <span>{heroDetail.promiseGold}EOCC</span>
        </p>
        <p>
          <span>
            <Seperate>保证金</Seperate>
          </span>
          <span>:</span>
          <span>{heroDetail.sure}USDT</span>
        </p>
        {heroStatus === 1 && (
          <p>
            <span>
              <Seperate>剩余时长</Seperate>
            </span>
            <span>:</span>
            <span>{sec_to_time(rest)}</span>
          </p>
        )}
        <p>
          <span>
            <Seperate>已产出</Seperate>
          </span>
          <span>:</span>
          <span>{heroDetail.productGold}EOCC</span>
        </p>
      </div>
      {heroStatus !== 1 && (
        <div className={css.DetailFooter}>
          <Button
            onClick={() => {
              setHeroModal("sendBack");
            }}
          >
            退还
          </Button>
        </div>
      )}
      <BottomPlaceholder />
      {renderModal()}
    </div>
  );
};
export default inject("view")(observer(MyEmployeeDetail));
