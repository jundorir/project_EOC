import classNames from "classnames";
import React from "react";
import css from "./index.module.less";

export default function Notify(props) {
  const { content, editable, grey, name, placeholder, onChange = () => {}, ...reset } = props;
  return (
    <div
      {...reset}
      className={classNames(css.noti, { [css.grey]: grey })}
    >
      {editable ? (
        <textarea
          value={content}
          autoComplete="off"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
}
