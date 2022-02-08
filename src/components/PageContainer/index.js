import classNames from "classnames";
import React from "react";
import css from "./index.module.less";

export default function PageContainer(props) {
  const { className, children } = props;
  return <div className={classNames(css.page_container, className)}>{children}</div>;
}
