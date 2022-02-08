import Button from "@components/Button";
import classNames from "classnames";
import React from "react";
import ReactDom from "react-dom";
import css from "./index.module.less";
import GeneralModal from "@components/Modal/GeneralModal";
export default function PrizeOpenModal(props) {
  if (!props.visible) {
    return null;
  }
  const {showSun = false, title = '', showTexture = false, showCancel, onConfirm, onCancel, buttonSize, cancelText, confirmText, footer} = props
  return (
    <GeneralModal
      showSun={showSun}
      visible={true}
      title={title}
      showTexture={showTexture}
      showCancel={showCancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      buttonSize={buttonSize}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      {props.children}
    </GeneralModal>
    // <div className={css.mask}>
    //   <div className={css.body}>
    //     <div className={css.cloak}></div>
    //     <div className={css.content}>
    //       {showSun ? <div className={css.contentSun}></div> : null}
    //       {title ? <h6 className={css.title}>{title}</h6> : null}
    //       {showTexture? <div className={classNames(css.texture, css.texture_up)}></div> : null}
    //       <div className={css.main}>{props.children}</div>
    //       {showTexture?  <div className={classNames(css.texture, css.texture_down)}></div> : null}
    //       <div className={css.actions}>
    //         {props.footer !== null ? (
    //           props.footer
    //         ) : (
    //           <>
    //             {props.showCancel && (
    //               <Button onClick={props.onCancel} size={props.buttonSize}>
    //                 {props.cancelText}
    //               </Button>
    //             )}
    //             <Button onClick={props.onConfirm} size={props.buttonSize}>
    //               {props.confirmText}
    //             </Button>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

PrizeOpenModal.defaultProps = {
  title: "确定",
  cancelText: "取消",
  confirmText: "确定",
  showCancel: true,
  buttonSize: 'middle',
  onCancel: () => {},
  onConfirm: () => {},
  footer: null,
  visible: false,
};
