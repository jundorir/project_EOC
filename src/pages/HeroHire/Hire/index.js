// 首页
import { useEffect, useState } from "react";
import { Form, Input, Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import HeroSelector from "@components/HeroSelector";
import Button from "@components/Button";

import css from "./index.module.less";
//status 0-雇佣结束，1-雇佣中，2-待雇佣，3-待领取

const Hire = (props) => {
  const { view, userStore } = props;
  const { heroStore } = userStore;
  const heroList = [
    {
      id: "1",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "2",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "3",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "4",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "5",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "6",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
    {
      id: "7",
      productGold: 2000,
      sure: 2000,
      restTime: 1000000,
      promiseGold: 2000,
      hero: {},
    },
  ];
  const [rare, setRare] = useState("ALL");
  const [selectedHero, setSelectedHero] = useState({});

  const onFinish = (values) => {
    console.log("values", values);
    Toast.show({
      content: "出租成功",
      position: "bottom",
      afterClose: () => {
        view.goBack();
      },
    });
  };

  return (
    <div className={css.Hire}>
      <div className={css.HeroConfig}>
        <div className={css.CardBox}>
          <WrappedHeroCard
            hero={selectedHero}
            style={{
              transform: "scale(.45)",
              transformOrigin: "left top",
            }}
          />
        </div>
        <Form
          className={css.HeroConfigForm}
          onFinish={onFinish}
          initialValues={{ productGold: 1500, promiseGold: 2500, hireTime: 24 }}
          footer={
            <Button type="submit" color="primary">
              确认出租
            </Button>
          }
        >
          <Form.Item name="productGold" label="需保证产量:">
            <Input
              placeholder="请输入保证产量"
              className={css.HeroConfigFormInput}
            />
          </Form.Item>
          <Form.Item name="promiseGold" label="保证金:">
            <Input
              placeholder="请输入保证金额"
              className={css.HeroConfigFormInput}
            />
          </Form.Item>
          <Form.Item name="hireTime" label="出租时间:">
            <Input
              placeholder="请输入出租时间"
              className={css.HeroConfigFormInput}
            />
          </Form.Item>
        </Form>
      </div>

      <div className={css.SelectorArea}>
        <HeroSelector
          rare={rare}
          setRare={setRare}
          setOrder={(value) => {
            heroStore.setOrder(value);
          }}
        />
      </div>
      <div className={css.HeroArea}>
        {heroStore.restHero.map((hero, index) => {
          const checked = selectedHero === hero;
          return (
            <div key={index} className={css.HeroThumb}>
              <HeroThumbnail
                hero={hero}
                checked={checked}
                onClick={() => {
                  setSelectedHero(checked ? null : hero);
                }}
              />
            </div>
          );
        })}
        <div className={css.HeroThumb}></div>
        <div className={css.HeroThumb}></div>
        <div className={css.HeroThumb}></div>
      </div>
      <BottomPlaceholder />
    </div>
  );
};

export default inject("view", "userStore")(observer(Hire));
