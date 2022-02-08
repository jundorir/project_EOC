import React from "react";
import css from "./index.module.less";

export default function ScrollNumber(props) {
  const { value } = props;
  return (
    <div className={css.number}>
      <ul className={css[`number_${value === '.' ? '10' : value}`]}>
        <li>0</li>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>.</li>
      </ul>
    </div>
  );
}
