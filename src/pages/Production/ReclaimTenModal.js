import Button from "@components/Button";
import InputModel from "@components/Modal/GeneralModal/InputModel";
import { inject, observer } from "mobx-react";
import React from "react";
import css from "./index.module.less";

const singleReclaimMMR = 100; // 开垦一次需要的MMR

function ReclaimTenModal(props) {
  const {
    languageStore: { language },
  } = props;
  const { authCount, onAuthorization, MMR_balance, canOpenLandMax, ...rest } =
    props;

  function renderFooter(onCancel, onConfirm, value = 0) {
    const needMMR = value * singleReclaimMMR;
    const isApprove = !needMMR || authCount >= needMMR;
    const isCanSubmit =
      !!value &&
      /^\d+$/.test(value) &&
      canOpenLandMax >= value &&
      MMR_balance >= needMMR;
    return (
      <div style={{ margin: "30px 0" }} className={css.actions}>
        <Button disabled={isApprove} onClick={() => onAuthorization()}>
          {language.auth}
        </Button>
        <Button
          disabled={!isCanSubmit}
          onClick={() => {
            onConfirm(value);
          }}
        >
          {language.OK}
        </Button>
      </div>
    );
  }

  return (
    <InputModel
      title={language.reclaim_modal_title}
      showInput={true}
      required={true}
      placeholder={language.reclaim_modal_placeholder}
      footer={renderFooter}
      {...rest}
    >
      <p>{language.per_consume}</p>
      {language.reclaim_modal_content}
    </InputModel>
  );
}

export default inject("languageStore")(observer(ReclaimTenModal));
