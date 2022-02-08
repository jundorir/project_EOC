// import Button from "@components/Button";
// import GeneralModal from "@components/Modal/GeneralModal";
// import React, { useEffect } from "react";
// import css from "./index.module.less";
// import { inject, observer } from "mobx-react";

// function InviteModal(props) {
//   const { onAccept, onReject, chain, userStore } = props;
//   const { unionStore } = userStore;
//   const { unionInviteLogList } = unionStore;
//   useEffect(() => {
//     if (chain.address && chain.token && props.visible) {
//       unionStore.queryGetGuildInviteLogList({
//         user: chain.address,
//         sign: chain.token,
//       });
//     }
//   }, [props.visible, chain.address, chain.token]);
//   return (
//     <GeneralModal
//       title="邀请列表"
//       showCancel={false}
//       confirmText="取消"
//       {...props}
//     >
//       {unionInviteLogList.data.length > 0 ? (
//         <ul className={css.invite_list}>
//           {unionInviteLogList.data.map((item) => (
//             <li className={css.invite_item} key={item.guild_id}>
//               <div className={css.info}>
//                 <p>{item.name}</p>
//                 <p>{item.nickname}邀请你加入公会</p>
//               </div>
//               <div className={css.action}>
//                 <Button onClick={() => onAccept(item)} size="small">
//                   接受
//                 </Button>
//                 <Button onClick={() => onReject(item)} size="small">
//                   拒绝
//                 </Button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         "暂无邀请记录"
//       )}
//     </GeneralModal>
//   );
// }

// export default inject("chain", "userStore")(observer(InviteModal));
