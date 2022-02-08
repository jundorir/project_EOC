import Button from "@components/Button";
import React, { useRef } from "react";
import defaultUnionAvatar from "@assets/images/union/default_union_avatar.png";
import css from "./index.module.less";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
function UnionLogan(props) {
  const {
    languageStore: { language },
  } = props;
  return (
    <div className={classNames(css.logan, { [css.create]: props.showUpload })}>
      <div className={css.photo}>
        <img
          onClick={props.onClick}
          src={props.showUpload ? defaultUnionAvatar : props.url}
          alt=" "
        />
      </div>
      {props.showModify && (
        <div className={css.btn}>
          <Button onClick={props.onClick} size="middle">
            {language.change_head}
          </Button>
        </div>
      )}
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
export default inject("languageStore")(observer(UnionLogan));
