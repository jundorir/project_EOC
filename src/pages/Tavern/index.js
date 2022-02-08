// 酒馆
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import Banner from "./Banner";
import DrawPrize from "./DrawPrize";
import Modal from "./Modal";
import Button from "@components/Button";
import HeroCard from "@components/Card/HeroCard";
import css from "./index.module.less";
import ActIcon from "@assets/images/tavern/act_icon.png";
import blind_box_1 from "@assets/images/tavern/blind_box_1.png";
import blind_box_2 from "@assets/images/tavern/blind_box_2.png";
import blind_box_3 from "@assets/images/tavern/blind_box_3.png";
import icon_gold from "@assets/images/tavern/icon_gold.png";
import icon_mmr from "@assets/images/tavern/icon_mmr.png";
import icon_usdt from "@assets/images/tavern/icon_usdt.png";
import TavernConfig from "@common/const/define/tavern";
import MessageModal from "@components/Modal/HeroModal/MessageModal";
import { Toast } from "antd-mobile";

function Tavern(props) {
  const { userStore, tavernStore, languageStore } = props;
  const { heroStore } = userStore
  const BANNER_LIST = [
    {
      name: languageStore.language.Starter_Box,
      disabled: false,
      img: blind_box_3
    },
    {
      name: languageStore.language.Primary_Box,
      disabled: false,
      img: blind_box_2
    },
    {
      name: languageStore.language.Premium_Box,
      disabled: true,
      img: blind_box_1
    },
  ]
  const [navList] = useState(TavernConfig);
  const [curNav, setCurNav] = useState(navList[0]);
  const [bannerCur, setBannerCur] = useState(0);

  const [visible, setVisible] = useState(false);
  const [doDrawPrize, setDoDrawPrize] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [bannerList, setBannerList] = useState([]);
  const [prizeData, setPrizeData] = useState({});
  const [probability, setProbability] = useState([]);
  const [heroList, setHeroList] = useState([
    ...heroStore.config,
  ]);
  let isEnoughCost =
    userStore.GOLD - curNav.gold >= 0 &&
    userStore[curNav.symbol] - curNav.number >= 0;

  const btnList = [
    {
      title: "一次",
      desc: curNav.costTips,
    },
  ];

  /**
   * @description 监听顶部菜单变化  渲染不同数据
   * */
  useEffect(() => {
    if (curNav.id) {
      let arr = [];
      const heroLevelIds = {
        1: 4,
        2: 3,
        3: 2,
      }
      arr = getBoosHeroByLevel(heroLevelIds[curNav.id])
      arr = arr.slice(0,3)
      setBannerList([...arr]);
    }
  }, [curNav]);

  /**
   * @description 获取对应稀有度的英雄列表
   * */
  function getBoosHeroByLevel(heroLevel){
    // 过滤的英雄，产品觉得不好看
    const filterHero = [42];
    if(!heroLevel) {
      return [];
    }
    return heroList.filter((item)=> ( item.herolevel === heroLevel && !filterHero.includes(item.id)))
  }

  /**
   * @description 购买盲盒按钮点击
   * */
  async function handleBtn() {
    const { symbol, number, type } = curNav;
    const isApprove = userStore[`${symbol}_APPROVEMENT`] - number > 0;
    if (!isApprove) {
      // todo 授权
      setShowModal(symbol);
      return;
    }

    try {
      // 设置动画的显示
      // setDoDrawPrize(true);
      // 盲盒结果
      const result = await tavernStore.lottery(type, (value) => {
        if (value === true) {
          setDoDrawPrize(value);
        }
      });
      if (result) {
        userStore.queryAllBalance();
        userStore.queryAllowance("USDT");
        userStore.queryAllowance("MMR");

        if (result.type === "NFT") {
          const hero = userStore.heroStore.createHero(
            result.baseId,
            result.tokenId
          );
          //todo 显示NFT
          //设置英雄显示
          setPrizeData({
            type: "NFT",
            heroData: hero,
          });
        }

        if (result.type === "MATERIAL") {
          // todo 显示 素材
          //设置道具显示
          if (result?.materialKey) {
            userStore.materialStore.add(result.materialKey);
            setPrizeData({
              type: "MATERIAL",
              goods: [
                {
                  key: result.materialKey, //物品类型
                  num: "1", //物品数量
                },
              ],
            });
          }
        }
      } else {
        setDoDrawPrize(false);
        Toast.show({
          icon: "fail",
          content: languageStore.language.online_transaction_error,
        });
      }
    } catch {
      setDoDrawPrize(false);
      setPrizeData({});
    }
  }

  async function toApprove() {
    const { symbol, number } = curNav;
    const result = await userStore.toApprove(symbol);
    if (result.status) {
      if (result.approvement - number > 0) {
        setShowModal(null);
      }
    }
  }
  function handleBannerChange(index) {
    setBannerCur(index)
    setCurNav(navList[index])
  }
  function getTextAlign(index) {
    if(bannerCur === index){
      return 'center'
    }else if(bannerCur < index){
      return  'right'
    }else {
      return  'left'
    }
    // bannerCur === index ? 'center' : 'left'
  }
  function renderModal() {
    if (showModal) {
      const msg = `${showModal} ${languageStore.language.auth_number_error}`;
      return (
        <MessageModal
          title={`${languageStore.language.auth} ${showModal}`}
          btnTitle={languageStore.language.auth}
          onSubmit={toApprove}
          closeModal={() => {
            setShowModal(null)
          }}
        >
          <div className={css.content}>
            <div className={css.tips2}>
              <div>{msg}</div>
            </div>
            <div className={css.tips1}>
              <div>{languageStore.language.auth_next_operation_hint}</div>
            </div>
          </div>
        </MessageModal>
      );
    }
    return null;
  }
  return (
    <div className={css.pageMain}>
      <div className={css.pageHeader}>
        <div className={css.pageHeaderWallet}>
          <div className={css.headerNum}>
            <img src={icon_gold} />
            <label>{userStore.GOLD}</label>
          </div>
          <div className={css.headerNum}>
            <img src={icon_mmr} />
            <label>{userStore.MMR}</label>
          </div>
          <div className={css.headerNum}>
            <img src={icon_usdt} />
            <label>{userStore.USDT}</label>
          </div>
        </div>

      </div>

      <div className={css.content}>
        <div className={css.banner}>
          <Banner list={BANNER_LIST} bannerCur={bannerCur} BANNER_LIST={BANNER_LIST} onChange={handleBannerChange} />
        </div>
        <div className={css.contentImg}>
          <img src={ActIcon} />
        </div>
        {/*<p className={css.contentTit}>{curNav.title}</p>*/}
        {/*<div className={css.contentDesc}>*/}
        {/*  <span>{curNav.desc}</span>*/}
        {/*</div>*/}

        <div className={css.contentCtrl}>
          <div className={css.contentCtrItem}>
            <Button
              onClick={() => {
                setProbability(curNav.probability)
                setVisible(true);
              }}
            >
              {languageStore.language.Probability}
            </Button>
          </div>
          {btnList.map((item, index) => (
            <div key={index} className={css.contentCtrItem}>
              <Button
                onClick={() => {
                  handleBtn(item.val);
                }}
                disabled={!isEnoughCost || BANNER_LIST[bannerCur].disabled}
              >
                {languageStore.language.Once}
              </Button>
              <p className={css.contentCtrlText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={css.pageFooter}></div>
      <Modal
        list={probability}
        visible={visible}
        setVisible={setVisible}
      />
      {doDrawPrize ? (
        <DrawPrize
          prizeData={prizeData}
          closeModal={() => {
            setPrizeData({});
            setDoDrawPrize(false);
          }}
        />
      ) : null}

      {renderModal()}
    </div>
  );
}

export default inject("tavernStore", "userStore", "languageStore")(observer(Tavern));
