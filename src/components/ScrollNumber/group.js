import React from "react";
import css from "./index.module.less";
import ScrollNumber from ".";

export default function Group(props) {
  const { value } = props;
  const newValues = `${value > 10000 ? value / 1000 : value}`
    .split("")
    .reverse();
  return (
    <>
      <div className={css.group}>
        {newValues.map((n, i) => (
          <ScrollNumber key={i} value={n} />
        ))}
      </div>{" "}
      {value > 10000 && "K"}
    </>
  );
}
