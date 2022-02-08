// 酒馆
import { Fragment, useEffect, useRef, useState } from "react";
import css from "./index.module.less";
import BannerTouch from "@utils/bannerTouch";
import {inject, observer} from "mobx-react";

function Banner(props) {
  const { list = [], onChange, bannerCur, BANNER_LIST, languageStore } = props;
  const bannerEl = useRef(null);
  const [bannerTouch, setBannerTouch] = useState(null);
  useEffect(() => {
    if (bannerEl && bannerEl.current) {
      setBannerTouch(new BannerTouch({ ele: bannerEl.current , onChange: (index)=> {
          onChange(index)
        }}));
    }
  }, [bannerEl]);
  useEffect(() => {
    if (list && list.length) {
      bannerTouch && bannerTouch.reload();
    }
  }, [list.length]);
  function toBanner(index) {
    bannerTouch && bannerTouch.toPage(index);
  }
  return (
    <div className={css.banner} ref={bannerEl}>
      {list.map((item, index) => (
        <div key={index} onClick={()=> {toBanner(index)}} className={css.bannerItem}>
          <div className={`${css.bannerTit} ${index !== bannerCur ? css.bannerTitOp : null}`} >{item.name}</div>
          <div className={css.bannerImg}>
            {(BANNER_LIST[bannerCur].disabled && index === bannerCur)? <div>{languageStore.language.waiting_to_open}</div> : null}
            <img src={item.img}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default inject( "languageStore")(observer(Banner));
