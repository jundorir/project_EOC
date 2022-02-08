//仓库
import GoldCoin from "@assets/images/material/GoldCoin.png";
import MMR from "@assets/images/material/MMR.png";
import USDT from "@assets/images/material/USDT.png";
import Flash from "@assets/images/material/Flash.png";
import InventoryModal from "@components/Modal/InventoryModal";
import GiveModal from "@components/Modal/GiveModal";
import CustomStepperForGive from "@components/CustomStepperForGive";
import useMaterial from "@common/const/define/Material";

import { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import { Toast, TextArea } from "antd-mobile";
import user from "src/store/user";

const Inventory = (props) => {
  const {
    userStore,
    languageStore: { language },
  } = props;
  const { materialStore } = userStore;
  const [inventoryModal, setInventoryModal] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const Material = useMaterial(language);
  const [formData, setFormData] = useState({
    amount: 0,
    addr: "",
  });
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
  const myCapital = [
    {
      type: GoldCoin,
      id: "goldCoin",
      number: userStore.GOLD,
    },
    {
      type: MMR,
      id: "MMR",

      number: userStore.MMR,
    },
    {
      type: USDT,
      id: "USDT",

      number: userStore.USDT,
    },
    {
      type: Flash,
      id: "Flash",
      number: userStore.pp,
    },
  ];
  const myBag = [
    {
      materialKey: "ExperienceBookPrimary",
      name: ExperienceBookPrimary,
      number: materialStore.ExperienceBookPrimary,
    },
    // {
    //   name: ExperienceBookIntermediate,
    //   number: materialStore.ExperienceBookIntermediate,
    // },
    {
      materialKey: "ExperienceBookSenior",
      name: ExperienceBookSenior,
      number: materialStore.ExperienceBookSenior,
    },
    {
      materialKey: "EmpireHoeToken",

      name: EmpireHoeToken,
      number: materialStore.EmpireHoeToken,
      // canUse: true,
    },
    {
      materialKey: "GuildToken",

      name: GuildToken,
      number: materialStore.GuildToken,
    },
    {
      materialKey: "SpiritDrug",

      name: SpiritDrug,
      number: materialStore.SpiritDrug,
      canUse: true,
      onUse: async () => {
        if (user.pp === 50) {
          Toast.show({
            content: language.Stamina_is_full,
            position: "center",
            afterClose: () => {},
          });
          return;
        }
        try {
          const result = await materialStore.useSpiritDrug();
          if (result) {
            Toast.show({
              content: language.Use_success,
              position: "center",
              afterClose: () => {},
            });
            userStore.queryUserInfo();
            setInventoryModal(null);
            return;
          }
        } catch {}
        Toast.show({
          content: language.Use_failed,
          position: "center",
          afterClose: () => {},
        });
      },
    },
    // {
    //   name: TreasureBox,
    //   number: materialStore.TreasureBox,
    // },
    // {
    //   name: Gold,
    //   number: userStore.GOLD,
    // },
    // {
    //   name: MonthCard,
    //   number: 2,
    // },
  ];
  // 修改名称输入框
  function changeHandle(value) {
    setFormData({
      ...formData,
      addr: value,
    });
  }
  //
  const giveHandler = async (materialKey) => {
    console.log("materialKey<", materialKey);
    try {
      const result = await materialStore.sendMaterialToOther(
        formData.addr,
        formData.amount,
        materialKey
      );
      if (result) {
        Toast.show({
          icon: "success",
          content: language.Give_success,
          position: "center",
          afterClose: () => {},
        });
        userStore.queryUserInfo();
        setInventoryModal(null);
        return;
      }
    } catch {}
    Toast.show({
      icon: "fail",
      content: language.Give_failed,
      position: "center",
      afterClose: () => {},
    });
  };

  function renderModal() {
    if (inventoryModal === "canUse") {
      return (
        <InventoryModal
          onSubmit={modalInfo.onUse}
          disabled={modalInfo.number <= 0}
          closeModal={() => {
            setInventoryModal(null);
          }}
          onGive={() => {
            setInventoryModal("give");
          }}
        >
          <div className={css.invenCont}>
            <img src={modalInfo.name.images} alt="" />
            <h5>{modalInfo.name.title}</h5>
            <p>
              <span>{language.Number_of_holdings}：</span>
              {modalInfo.number}
            </p>
            <div className={css.invenInfo}>
              {/* <span>
                {modalInfo.name.info || `${modalInfo.name.title}的详细解释`}
              </span> */}
              <span>{modalInfo.name.info || `${modalInfo.name.title}`}</span>
            </div>
          </div>
        </InventoryModal>
      );
    }
    if (inventoryModal === "contUse") {
      return (
        <InventoryModal
          canUse={false}
          closeModal={() => {
            setInventoryModal(null);
          }}
          onGive={() => {
            setInventoryModal("give");
          }}
        >
          <div className={css.invenCont}>
            <img src={modalInfo.name.images} alt="" />
            <h5>{modalInfo.name.title}</h5>
            <p>
              <span>{language.Number_of_holdings}：</span>
              {modalInfo.number}
            </p>
            <div className={css.invenInfo}>
              {/* <span>
                {modalInfo.name.info || `${modalInfo.name.title}的详细解释`}
              </span> */}
              <span>{modalInfo.name.info || `${modalInfo.name.title}`}</span>
            </div>
          </div>
        </InventoryModal>
      );
    }
    if (inventoryModal === "give") {
      return (
        <GiveModal
          visible={inventoryModal}
          closeModal={() => {
            setInventoryModal(null);
          }}
          disabled={
            modalInfo.number < formData.amount || modalInfo.number === 0
          }
          onConfirm={() => giveHandler(modalInfo.materialKey)}
        >
          <div className={css.give_container}>
            <div className={css.invenCont_give}>
              <img src={modalInfo.name.images} alt="" />
              <h5>{modalInfo.name.title}</h5>
              <p>
                <span>{language.Number_of_holdings}：</span>
                {modalInfo.number}
              </p>
            </div>
            <div className={css.giveConfig}>
              <div className={css.form_item}>
                <div className={css.form_item_name}>{language.Give_number}</div>
                <div className={css.form_item_stepper}>
                  <CustomStepperForGive
                    value={formData.amount}
                    onChange={(newAmount) =>
                      setFormData({
                        ...formData,
                        amount: newAmount,
                      })
                    }
                    step={1}
                    placeholder={language.Please_input_give_number}
                    digits={0}
                  />
                  <div
                    className={css.give_max}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        amount: modalInfo.number,
                      });
                    }}
                  ></div>
                </div>
              </div>
              <div className={css.form_item}>
                <div className={css.form_item_name}>
                  {language.Recipient_address}
                </div>
                <TextArea
                  className={css.give_addr}
                  placeholder={language.Please_input_recipient_address}
                  autoComplete="off"
                  onChange={changeHandle}
                  value={formData.addr}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </div>
            </div>
          </div>
        </GiveModal>
      );
    }

    return null;
  }

  useEffect(() => {
    userStore.queryAllBalance();
  }, [userStore]);

  return (
    <div className={css.Inventory}>
      <div className={css.TopInfo}>
        {myCapital.map((item) => {
          return (
            <div className={css.infoItem} key={item.id}>
              <img src={item.type} alt="" />
              <span>{item.number}</span>
            </div>
          );
        })}
      </div>
      <div className={css.Bag}>
        {myBag.map((item) => {
          if (item.number) {
            return (
              <div
                className={css.BagItem}
                key={item.materialKey}
                onClick={() => {
                  setInventoryModal(item.canUse ? "canUse" : "contUse");
                  setModalInfo(item);
                }}
              >
                <img src={item.name.images} alt="" />
                <span>{item.number > 999 ? "999+" : item.number}</span>
                <h5>{item.name.title}</h5>
              </div>
            );
          }
        })}
        <div className={css.BagItem}></div>
        <div className={css.BagItem}></div>
        <div className={css.BagItem}></div>
      </div>
      {renderModal()}
    </div>
  );
};
export default inject(
  "view",
  "userStore",
  "languageStore"
)(observer(Inventory));
