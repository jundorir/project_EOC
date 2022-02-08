import Button from "@components/Button";
import Dialog from "@components/Dialog";
import React, { useState, useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";

// 公会日志
function LogModal(props) {
  const {
    chain,
    userStore,
    languageStore: { language },
  } = props;
  const { unionStore } = userStore;
  const { data, total } = unionStore.unionLogList;
  // 请求参数
  const [queryParams, setQueryParams] = useState({
    pageSize: 10,
    pageIndex: 1,
  });
  // 请求数据
  useEffect(() => {
    if (chain.address && chain.token && props.visible) {
      unionStore.queryGetGuildLogList({
        user: chain.address,
        guild_id: unionStore.unionInfo.guild_id,
        page: queryParams.pageIndex,
        pagesize: queryParams.pageSize,
        sign: chain.token,
      });
    }
  }, [
    chain.address,
    chain.token,
    props.visible,
    queryParams.pageIndex,
    queryParams.pageSize,
  ]);

  // 下一页
  function pageDownHandle() {
    setQueryParams({
      ...queryParams,
      pageIndex: queryParams.pageIndex + 1,
    });
  }

  // 上一页
  function pageUpHandle() {
    let nextPage = queryParams.pageIndex - 1;
    if (nextPage <= 0) {
      nextPage = 1;
    }
    setQueryParams({
      ...queryParams,
      pageIndex: nextPage,
    });
  }

  const totalPage = Math.ceil(total / data.pageSize);

  return (
    <Dialog visible={props.visible} bodyClass={css.body}>
      <button onClick={props.onClose} className={css.close}></button>
      <p className={css.title}>{language.Log}</p>
      <br />
      {/* <p className={css.date}>
        {new Date().getMonth() + 1}.{new Date().getDate()}
      </p> */}
      <ul className={css.list}>
        {data.map((item) => (
          <li key={item.id}>
            {item.date} {item.content}
          </li>
        ))}
      </ul>
      <div className={css.actions}>
        <Button
          disabled={queryParams.pageIndex === 1}
          onClick={pageUpHandle}
          size="middle"
        >
          {language.prePage}
        </Button>
        <Button
          disabled={queryParams.pageIndex * queryParams.pageSize >= total}
          onClick={pageDownHandle}
          size="middle"
        >
          {language.nextPage}
        </Button>
      </div>
    </Dialog>
  );
}

export default inject(
  "chain",
  "userStore",
  "languageStore"
)(observer(LogModal));
