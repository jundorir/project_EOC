// 首页
import css from "./index.module.less";
import Avatar from "./Avatar";
import Resources from "./Resources";
import OperationList from "./OperationList";
import WorkSpace from "./WorkSpace";
import { Fragment, useState, useRef, useEffect } from "react";
import Modal from "@components/Modal/ConfirmModal";
import ChooseModal from "@components/Modal/ChooseModal";
import IMG from "@assets/images/head/person/1.png";
import HeadPortrait from "@components/HeadPortrait";
import Button from "@components/Button";
import chain from "src/store/chain";
import { Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";
import GeneralModal from "@components/Modal/GeneralModal";

function Home(props) {
  const {
    view,
    userStore,
    chain,
    languageStore: { language },
  } = props;
  const { headStore } = userStore;
  let reader = new FileReader();
  const input = useRef(null);
  const [cal, setCal] = useState("");
  const [choose, setChoose] = useState("");
  const [initName, setiIitName] = useState("");
  const [imageUrl, setImageUrl] = useState(IMG);

  useEffect(() => {
    setiIitName(userStore.nickname || "");
  }, [userStore.nickname]);
  /**
   *  监听上传
   */
  // function handleImage() {
  //   setImageUrl(reader.result);
  //   console.log("imageUrl的地址", imageUrl);
  // }
  // useEffect(() => {
  //   reader.addEventListener("load", handleImage, false);
  //   return () => {
  //     reader.removeEventListener("load", handleImage);
  //   };
  // }, [reader]);
  /**
   * 上传选择文件
   */
  // function uploadHandle() {
  //   input.current.click();
  // }
  // function onFileChange(e) {
  //   const files = e.target.files;
  //   if (files.length > 0) {
  //     if (files[0].type?.indexOf("image") !== -1) {
  //       console.log("reader", reader, reader.readyState);
  //       reader.readAsDataURL(files[0]);
  //     } else {
  //       Toast.show({
  //         icon: "fail",
  //         content: `上传的文件格式不正确`,
  //         duration: 1000,
  //       });
  //     }
  //   }
  // }
  function chooseHead(way) {
    if (way === "person") {
      setChoose("person");
    }
  }
  async function modifyNickname() {
    if (initName.length > 0 && initName !== userStore.nickname) {
      const result = await userStore.modifyInfo({
        user: chain.address,
        nickname: initName,
        sign: chain.token,
      });
      if (!result) {
        Toast.show({
          icon: "fail",
          content: language.net_wrang,
          duration: 500,
        });
        return;
      }
      if (result.code - 1 === 0) {
        // Toast.show({
        //   icon: "success",
        //   content: "修改昵称成功",
        //   duration: 500,
        //   // afterClose: () => {
        //   //   setCal("");
        //   // },
        // });
        setCal("");
        GeneralModal.alert({
          content: language.success,
        });
        // setiIitName(userStore.nickname);
        userStore.queryUserInfo();
      } else {
        // Toast.show({
        //   icon: "fail",
        //   content: result.msg,
        //   duration: 500,
        // });
        GeneralModal.alert({
          title: language.failure,
          content: result.msg,
        });
      }
    } else {
      // Toast.show({
      //   content: "昵称无效",
      //   duration: 500,
      // });
      GeneralModal.alert({
        title: language.failure,
        content: language.invalid,
      });
    }
  }
  /**
   * 渲染个人信息弹窗
   */
  function renderModal() {
    if (choose === "person") {
      return (
        <ChooseModal
          way="headArray"
          closeModal={() => {
            setChoose("");
          }}
          closeCal={() => {
            setCal("");
          }}
          ID={userStore.head_id}
        />
      );
    }
    if (cal === "myProfile") {
      return (
        <Modal
          closeModal={() => {
            setCal("");
            userStore.init();
            setiIitName(userStore.nickname);
            // setiIitName("王者荣耀");
            // setImageUrl(IMG);
          }}
          content={
            <Fragment>
              <div className={css.top}>
                <HeadPortrait
                  IMG={
                    headStore.data.headArray[userStore.head_id] ||
                    headStore.data.none[0]
                  }
                  // onClick={() => {
                  //   uploadHandle();
                  // }}
                  onClick={() => {
                    chooseHead("person");
                  }}
                />
                <div className={css.name}>
                  <div>{language.Nickname}</div>
                  <div className={css.nameBox}>
                    <input
                      value={initName}
                      className={css.inputBox}
                      maxLength={10}
                      onChange={(e) => {
                        setiIitName(e.target.value.trim());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={css.button}>
                <Button
                  size="middle"
                  children={language.Change_Avatar}
                  // onClick={() => {
                  //   uploadHandle();
                  // }}
                  onClick={() => {
                    chooseHead("person");
                  }}
                />
                {/* <input
                  className={css.input}
                  accept="image/*"
                  onChange={(e) => {
                    onFileChange(e);
                  }}
                  ref={input}
                  type="file"
                /> */}
                <Button
                  size="middle"
                  children={language.Change_Nickname}
                  onClick={modifyNickname}
                  disabled={
                    userStore.nickname === initName || initName.length <= 0
                  }
                />
              </div>
              <div className={css.personalInfo}>
                <div>{language.Address}：</div>
                <div>{chain.address}</div>
              </div>
              <div className={css.box}>
                <div className={css.line}>
                  <div className={css.left}>EOCC</div>
                  <div className={css.right}>{userStore.GOLD}</div>
                </div>
                <div className={css.line}>
                  <div className={css.left}>MMR</div>
                  <div className={css.right}>{userStore.MMR}</div>
                </div>
                <div className={css.line}>
                  <div className={css.left}>USDT</div>
                  <div className={css.right}>{userStore.USDT}</div>
                </div>
              </div>
            </Fragment>
          }
        />
      );
    }
  }
  useEffect(() => {
    userStore.startInit();
  }, []);
  // useEffect(() => {
  //   userStore.init();
  // }, []);
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.homeBGI}>
          <div className={css.homeBGIInner}>
            <div className={css.layer}></div>
          </div>
        </div>
        <div className={css.homeFrameTop}>
          <Avatar profil={(calbak) => setCal(calbak)} />
        </div>
        <div className={css.homeFrameBottom}>
          <WorkSpace />
        </div>
        <div className={css.centerInner}>
          <Resources />
          <OperationList />
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject(
  "view",
  "userStore",
  "chain",
  "languageStore"
)(observer(Home));
