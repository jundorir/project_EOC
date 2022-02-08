// 加载静态资源

import { useState, useEffect } from "react";
import { Loading, ProgressBar } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { preload } from "@common/preload";
import { env } from "@common/const/env";
import css from "./index.module.less";

const ResourceLoading = ({ view }) => {
  const [percent, setPercent] = useState(5);

  useEffect(() => {
    // if (env === "development") {
    //   view.setResourceLoading();
    //   return;
    // }
    preload.forEach((v, idx, arr) => {
      var img = new Image();
      img.src = v;
      img.onload = () => {
        arr.successLength = (arr.successLength || 0) + 1;
        setPercent((arr.successLength / arr.length) * 100);
        if (arr.successLength === arr.length) {
          view.setResourceLoading();
        }
      };
    });
  }, []);
  return (
    <div className={css.ResourceLoading}>
      <div className={css.box}>
        <div className={css.title}>
          <p>Loading</p>
          <Loading color="primary" />
        </div>
        <ProgressBar percent={percent} className={css.progress} />
      </div>
    </div>
  );
};
export default inject("view")(observer(ResourceLoading));
