// 首页
import { useEffect, useState } from "react";
import { Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";

import BottomPlaceholder from "@components/BottomPlaceholder";
import WrappedHeroCard from "@components/Card/HeroCard";
import PropsCard from "@components/Card/PropsCard";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import MarketSelector from "@components/MarketSelector";
import Button from "@components/Button";
import CustomStepper from "@components/CustomStepper";
import useMaterial from "@common/const/define/Material";

import css from "./index.module.less";
import { HeroRarity } from "@common/const/define/hero";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
// 货币中列
const Coin_Map = {
  0: "EOCC",
  1: "USDT",
  2: "MMR",
  EOCC: 0,
  USDT: 1,
  MMR: 2,
};
const Sale = (props) => {
  const { userStore, languageStore } = props;
  const { heroStore, marketStore, materialStore } = userStore;
  const { language } = languageStore;
  const Material = useMaterial(language);
  const {
    ExperienceBookPrimary,
    ExperienceBookIntermediate,
    ExperienceBookSenior,
    EmpireHoeToken,
    GuildToken,
    SpiritDrug,
    TreasureBox,
    Gold,
    MonthCard,
  } = Material;

  //道具列表
  const myBag = [
    {
      materialKey: "ExperienceBookPrimary",
      info: ExperienceBookPrimary,
      number: materialStore.ExperienceBookPrimary,
    },
    {
      materialKey: "ExperienceBookSenior",
      info: ExperienceBookSenior,
      number: materialStore.ExperienceBookSenior,
    },
    {
      materialKey: "EmpireHoeToken",
      info: EmpireHoeToken,
      number: materialStore.EmpireHoeToken,
    },
    {
      materialKey: "GuildToken",
      info: GuildToken,
      number: materialStore.GuildToken,
    },
    {
      materialKey: "SpiritDrug",
      info: SpiritDrug,
      number: materialStore.SpiritDrug,
    },
  ];
  //筛选栏
  const [rare, setRare] = useState("ALL");

  //被选中的英雄
  const [selectedHero, setSelectedHero] = useState(null);
  //被选中的道具key
  const [selectedPropkey, setSelectedPropkey] = useState(null);

  //展示的英雄列表
  const [list, setList] = useState([]);
  //确认上架的弹出框
  const [showModal, setShowModal] = useState(null);
  //上架英雄的配置表单
  const [formData, setFormData] = useState({
    coinType: Coin_Map.EOCC,
    price: 0,
  });
  //上架道具的配置表单
  const [propFormData, setPropFormData] = useState({
    coinType: Coin_Map.EOCC,
    price: 0,
    amount: 0,
  });
  useEffect(() => {
    myBag.map((item) => {
      if (item.number > 0) {
        marketStore.queryMaterialAllowance(item.materialKey);
      }
    });
  }, []);
  useEffect(() => {
    const tempList = [...heroStore.restHero];
    if (rare !== "ALL") {
      setList(tempList.filter((item) => item.rarity === HeroRarity[rare]));
    } else {
      setList(tempList);
    }
  }, [rare, heroStore.restHero]);

  function coinMapHandle(step = 1) {
    let newCoin = formData.coinType;
    newCoin = (newCoin + step + 3) % 3;

    setFormData({
      ...formData,
      coinType: newCoin,
    });
  }
  function coinMapPropHandle(step = 1) {
    let newCoin = propFormData.coinType;
    newCoin = (newCoin + step + 3) % 3;

    setPropFormData({
      ...propFormData,
      coinType: newCoin,
    });
  }
  // 提交出售英雄表单
  async function submitHandle() {
    if (!marketStore.isApproveToMarket) {
      setShowModal("hero");
      return;
    }

    try {
      // 授权nft给市场
      // const approveResult = await marketStore.approveHeroToMarket(
      //   selectedHero.tokenId
      // );
      // if (!approveResult) {
      //   Toast.show({
      //     icon: "fail",
      //     content: language.Authorized_failed,
      //     duration: 1000,
      //   });
      //   return;
      // }
      const symbol =
        formData.coinType === Coin_Map.EOCC
          ? "GOLD"
          : Coin_Map[formData.coinType];
      const result = await marketStore.upShelfHero(
        selectedHero,
        formData.price,
        symbol
      );
      if (result) {
        //
        Toast.show({
          icon: "success",
          content: language.Listed_successfully,
          duration: 1000,
        });
        setSelectedHero(null);
        return;
      }
    } catch {}
    Toast.show({
      icon: "success",
      content: language.Listed_failed,
      duration: 1000,
    });
  }
  // 提交出售道具表单
  async function submitPropsHandle() {
    if (
      marketStore[`${selectedPropkey}_MaterialMarket_APPROVEMENT`] -
        propFormData.amount <
      0
    ) {
      setShowModal("prop");
      return;
    }

    try {
      const symbol =
        propFormData.coinType === Coin_Map.EOCC
          ? "GOLD"
          : Coin_Map[propFormData.coinType];
      const result = await marketStore.upShelfMaterial(
        selectedPropkey,
        propFormData.amount,
        propFormData.price,
        symbol
      );
      if (result) {
        Toast.show({
          icon: "success",
          content: language.Listed_successfully,
          duration: 1000,
        });
        setSelectedPropkey(null);
        return;
      }
    } catch {}
    Toast.show({
      icon: "success",
      content: language.Listed_failed,
      duration: 1000,
    });
  }
  //英雄授权
  async function toApprove() {
    try {
      const result = await marketStore.approveHeroToMarket();
      if (result) {
        setShowModal(false);
        Toast.show(language.Authorized_success);
        return;
      }
    } catch {}
    Toast.show({
      icon: "fail",
      content: language.Authorized_failed,
      duration: 1000,
    });
  }
  //道具授权
  async function toPropApprove() {
    try {
      const result = await marketStore.toApproveMaterialMarket(selectedPropkey);
      if (result) {
        setShowModal(false);
        Toast.show(language.Authorized_success);
        return;
      }
    } catch {}
    Toast.show({
      icon: "fail",
      content: language.Authorized_failed,
      duration: 1000,
    });
  }

  function renderModal() {
    if (showModal === "hero") {
      return (
        <MessageModal
          title={language.NFT_NOT_APPROVE}
          btnTitle={language.auth}
          onSubmit={toApprove}
          closeModal={() => {
            setShowModal(null);
          }}
        >
          <div className={css.content}>
            <div className={css.tips1}>
              <div>{language.NFT_NOT_APPROVE_TIPS}</div>
            </div>
          </div>
        </MessageModal>
      );
    }
    if (showModal === "prop") {
      return (
        <MessageModal
          title={language.LACK_APPROVE}
          btnTitle={language.auth}
          onSubmit={toPropApprove}
          closeModal={() => {
            setShowModal(null);
          }}
        >
          <div className={css.content}>
            <div className={css.tips1}>
              <div>{language.Lack_approve_of_this_prop}</div>
            </div>
          </div>
        </MessageModal>
      );
    }
    return null;
  }

  //道具的出售
  if (rare === "Props") {
    return (
      <div className={css.Sale}>
        <div className={css.PropsConfig}>
          <div className={css.PropsTop}>
            <div className={css.CardBox}>
              {selectedPropkey ? (
                <div className={css.propBox}>
                  <PropsCard size="m" materialKey={selectedPropkey} />
                </div>
              ) : (
                <div className={css.EmptyBox}>
                  <span>{language.Please_choice_prop}</span>
                  <span>{language.Ready_to_sale_prop}</span>
                </div>
              )}
            </div>
            <div className={css.PropsForm}>
              <div className={css.form_item}>
                <div className={css.form_item_name}>{language.Coin_type}</div>
                <div className={css.switch}>
                  <button
                    onClick={() => coinMapPropHandle(-1)}
                    className={css.switch_left}
                  ></button>
                  <div className={css.switch_value}>
                    {Coin_Map[propFormData.coinType]}
                  </div>
                  <button
                    onClick={() => coinMapPropHandle()}
                    className={css.switch_right}
                  ></button>
                </div>
              </div>
              <div className={css.form_item}>
                <div className={css.form_item_name}>{language.Total_price}</div>
                <CustomStepper
                  value={propFormData.price}
                  onChange={(newPrice) =>
                    setPropFormData({
                      ...propFormData,
                      price: newPrice,
                    })
                  }
                  digits={Coin_Map[propFormData.coinType] === "EOCC" ? 0 : 4}
                />
              </div>
              <div className={css.form_item}>
                <div className={css.form_item_name}>{language.Number}</div>
                <CustomStepper
                  value={propFormData.amount}
                  onChange={(num) =>
                    setPropFormData({
                      ...propFormData,
                      amount: num,
                    })
                  }
                  max={materialStore[selectedPropkey]}
                  digits={0}
                />
              </div>
            </div>
          </div>
          <div className={css.PropsBot}>
            <div className={css.actions}>
              <Button
                disabled={
                  !selectedPropkey ||
                  propFormData.price - 0 === 0 ||
                  propFormData.amount - 0 === 0
                }
                onClick={submitPropsHandle}
              >
                {language.Confirm_Listing}
              </Button>
            </div>
            <p className={css.gasfee}>
              <span className={css.gasfee_label}>{language.fee}：</span>
              {/* 手续费金额生成 */}
              <span>{marketStore.materialFee}‰</span>
              {/* <span>{Coin_Map[formData.coinType]}</span> */}
            </p>
          </div>
        </div>

        <div className={css.SelectorArea}>
          <MarketSelector
            rare={rare}
            setRare={setRare}
            setOrder={(value) => {
              heroStore.setOrder(value);
            }}
          />
        </div>
        <div className={css.Bag}>
          {myBag.map((item) => {
            if (item.number) {
              let checked = selectedPropkey === item.materialKey;
              return (
                <div
                  className={css.BagItem}
                  key={item.materialKey}
                  onClick={() => {
                    setPropFormData({
                      ...propFormData,
                      price: 0,
                      amount: 0,
                    });
                    setSelectedPropkey(checked ? null : item.materialKey);
                  }}
                >
                  <img src={item.info.images} alt="" />
                  <span>{item.number > 999 ? "999+" : item.number}</span>
                  <h5>{item.info.title}</h5>
                  {checked && <div className={css.checked_border}></div>}
                </div>
              );
            }
          })}
          <div className={css.BagItem}></div>
          <div className={css.BagItem}></div>
          <div className={css.BagItem}></div>
        </div>
        <BottomPlaceholder />
        {renderModal()}
      </div>
    );
  }
  //英雄的出售
  return (
    <div className={css.Sale}>
      <div className={css.HeroConfig}>
        <div className={css.CardBox}>
          {selectedHero ? (
            <WrappedHeroCard
              hero={selectedHero}
              style={{
                transform: "scale(.45)",
                transformOrigin: "left top",
              }}
            />
          ) : (
            <div className={css.EmptyBox}>
              <span>{language.Please_choice_hero}</span>
              <span>{language.Ready_to_sale}</span>
            </div>
          )}
        </div>
        <div className={css.HeroConfig}>
          <div className={css.form_item}>
            <div className={css.form_item_name}>{language.Coin_type}</div>
            <div className={css.switch}>
              <button
                onClick={() => coinMapHandle(-1)}
                className={css.switch_left}
              ></button>
              <div className={css.switch_value}>
                {Coin_Map[formData.coinType]}
              </div>
              <button
                onClick={() => coinMapHandle()}
                className={css.switch_right}
              ></button>
            </div>
          </div>
          <div className={css.form_item}>
            <div className={css.form_item_name}>{language.Selling_Price}</div>
            <CustomStepper
              value={formData.price}
              onChange={(newPrice) =>
                setFormData({
                  ...formData,
                  price: newPrice,
                })
              }
              digits={Coin_Map[formData.coinType] === "EOCC" ? 0 : 4}
            />
          </div>
          <div className={css.actions}>
            <Button
              disabled={!selectedHero || formData.price - 0 === 0}
              onClick={submitHandle}
            >
              {language.Confirm_Listing}
            </Button>
          </div>
          <p className={css.gasfee}>
            <span className={css.gasfee_label}>{language.fee}：</span>
            {/* 手续费金额生成 */}
            <span>{marketStore.fee}‰</span>
            {/* <span>{Coin_Map[formData.coinType]}</span> */}
          </p>
        </div>
      </div>

      <div className={css.SelectorArea}>
        <MarketSelector
          rare={rare}
          setRare={setRare}
          setOrder={(value) => {
            heroStore.setOrder(value);
          }}
        />
      </div>
      <div className={css.HeroArea}>
        {list.map((hero, index) => {
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
      {renderModal()}
    </div>
  );
};

export default inject("view", "userStore", "languageStore")(observer(Sale));
