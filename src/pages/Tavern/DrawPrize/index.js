 // 酒馆
import {Fragment, useEffect, useRef, useState} from "react";
import {inject, observer} from "mobx-react";
import Button from "@components/Button";
import PrizeOpenModal from "@components/Modal/PrizeOpenModal";
import HeroCard from "@components/Card/HeroCard";
import {RewardIcon} from "@pages/Battle/List";
import useMaterial from "@common/const/define/Material";

 import css from "./index.module.less";
const animationPlayTime = 900
function DrawPrize(props) {
    const { list = [], visible, closeModal, prizeData, languageStore, } = props
    const Material = useMaterial(languageStore.language);
    // 控制接口请求中宝箱动画
    const [showLoading , setShowLoading] = useState(true);
    // 控制接口请求后宝箱打开动画
    const [showOpen , setShowOpen] = useState(false);
    const [loadingModal,  setLoadingModal] = useState(true);
    const [openModal,  setOpenModal] = useState(false);
    const [animationTime] = useState(Date.now());

    useEffect(()=> {
      if(prizeData?.type) {
        // timeout 为保证动画执行完毕
        let timeout = animationPlayTime - (Date.now() - animationTime)%animationPlayTime - 100;
        // return false
        console.log(timeout)
        setTimeout(()=>{
          // 显示宝箱打开动作
          setShowLoading(false)
          setShowOpen(true)
          // 保证宝箱打开动画显示完毕
          setTimeout(()=> {
            setLoadingModal(false)
            setOpenModal(true)
          }, 1000)
        }, timeout)
      }
    }, [prizeData, animationTime])
    return (
      <Fragment>
        <DrawPrizeLoading showLoading={showLoading} showOpen={showOpen} visible={loadingModal}/>
        <DrawPrizeOpen Material={Material} languageStore={languageStore} prizeData={prizeData} closeModal={closeModal} visible={openModal} />
      </Fragment>
    );
}
/**
 * @description loading动画 visibility：hidden  为了保证图片的加载  所以站位隐藏
 * */
function DrawPrizeLoading(props){
  const { showLoading, showOpen, visible, Material } = props
  let style = {}
  if(!visible) {
    // style.visibility = 'hidden'
    style.display = 'none'
  }
  return (
    <div className={css.drawPrize} style={style}>
      <div className={css.drawPrizeMain}>
        <div className={css.drawPrizeFooterBg} />
        {!showOpen ? <div className={`${css.drawPrizeShadow} ${showLoading ? css.drawPrizeShadowAnimation : ''}`} /> : null}
        {showOpen ? <div className={`${css.drawPrizeShadow} ${css.drawPrizeShadowAnimationDelay }`} />: null}
        {!showOpen ? <div className={`${css.drawPrizeChest} ${showLoading ? css.drawPrizeChestAnimation : ''}`} /> : null}
        <div className={`${css.drawPrizeChestOpen} ${showOpen ? css.drawPrizeChestOpenShow : ''}`}></div>
      </div>

    </div>
  );
}
function DrawPrizeOpen(props) {
  const { visible , closeModal, prizeData, languageStore, Material} = props
  const { heroData = {}, goods= [] } = prizeData
  if(!visible) {
    return  null
  }
  return (
    <div className={css.drawPrizeOpen}>
      {/*<div className={css.drawPrizeOpenLoading}></div>*/}
      {prizeData.type === 'MATERIAL'  ?
      <PrizeOpenModal
        showSun={true}
        visible={true}
        showCancel={false}
        onCancel={()=> {closeModal()}}
        onConfirm={()=> {closeModal()}}
        title={''}
        buttonSize={''}
      >
        <div className={css.drawPrizeProp}>
          {/*<div className={css.drawPrizeOpenLoading}></div>*/}
          <div className={css.propTitle}>{languageStore.language.get_props}</div>
          <div className={css.prizeList}>
            {goods.map((item, index)=> (
              <div key={index} className={css.prizeListItem}>
                <img src={Material[item.key]?.images} />
                <p>{Material[item.key]?.title}{item.num > 1 ? item.num: ''}</p>
              </div>
            ))}
          </div>
        </div>
      </PrizeOpenModal>
        : null}
      {prizeData.type === 'NFT' ? <DrawPrizeHero languageStore={languageStore} heroData={heroData} closeModal={closeModal} /> : null}
    </div>
  )
}
function DrawPrizeHero(props) {
  const {closeModal, heroData, languageStore} = props
  return (
    <div className={css.drawPrizeHero}>
      <div className={css.drawPrizeHeroContent}>
        <div className={css.sunBgLoop}></div>
        <div className={css.drawPrizeHeroContentHero}>
          <HeroCard
            hero={heroData}
            style={{ transform: "scale(1)", transformOrigin: "left top" }} />
        </div>
        <div className={css.drawPrizeHeroContentFooter}>
          <Button onClick={()=> {closeModal()}}>{languageStore.language.OK}</Button>
        </div>
      </div>
    </div>
  )
}
export default inject( "languageStore")(observer(DrawPrize));
