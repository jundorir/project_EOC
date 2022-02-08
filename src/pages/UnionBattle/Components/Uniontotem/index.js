import Button from "@components/Button";
import React, { useRef } from "react";
import defaultUnionAvatar from "@assets/images/union/default_union_avatar.png";
import css from "./index.module.less";
import classNames from "classnames";

export default function UnionLogan(props) {
  return (
    <div className={classNames(css.logan, props.own && css.ownLogan)}>
      <div className={css.photo}>
        <img
          onClick={props.onClick}
          src={props.showUpload ? defaultUnionAvatar : props.url}
          alt=" "
        />
      </div>
      <input
        className={css.input}
        onChange={props.onFileChange}
        ref={props.input}
        accept="image/*"
        type="file"
      />
    </div>
  );
}

UnionLogan.defaultProps = {
  onFileChange: () => {},
};
