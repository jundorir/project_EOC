import React from "react";
import css from "./index.module.less";
const Seperate = ({ children }) => {
  return (
    <span className={css.seperate}>
      {children.split("").map((item, index) => {
        return <span key={index}>{item}</span>;
      })}
    </span>
  );
};
export default Seperate;
