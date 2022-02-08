import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import { Input } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import OperationConfirmModal from "../OperationConfirmModal";
import css from "./index.module.less";
function SendHeroModal(props) {
  const {
    onSubmit,
    hero,
    languageStore: { language },
    ...others
  } = props;
  const [input, setInput] = useState("");
  return (
    <OperationConfirmModal
      {...others}
      onSubmit={() => {
        onSubmit?.(input);
      }}
      submitText={language.confirm}
      confirmDisabled={input === ""}
    >
      <div className={css.content}>
        <HeroThumbnail hero={hero} />
        <div className={css.address}>{language.goalAddress}</div>
        <div className={css.stepper}>
          <Input
            value={input}
            onChange={(value) => {
              setInput(value);
            }}
          />
        </div>
      </div>
    </OperationConfirmModal>
  );
}

export default inject("languageStore")(observer(SendHeroModal));
