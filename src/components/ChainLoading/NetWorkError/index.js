import css from "./index.module.less";
const languageContext = {
  cn_simple: {
    Querying_on_chain_results_please_wait: "区块链网络错误",
  },
  en: {
    Querying_on_chain_results_please_wait: "Blockchain network error",
  },
  cn_traditional: {
    Querying_on_chain_results_please_wait: "區塊鏈網絡錯誤",
  },
};
function NetWorkError(props) {
  const { language  } = props;
  const tips = languageContext[language];
  return (
    <div className={css.network}>
      <div className={css.box}>
        <div className={css.error} />
        <div className={css.tips}>{tips.Querying_on_chain_results_please_wait}</div>
      </div>
    </div>
  );
}

export default NetWorkError;
