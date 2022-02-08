import css from "./index.module.less";
import loading from "@assets/images/loading.png";
const languageContext = {
  cn_simple: {
    Querying_on_chain_results_please_wait: "正在查询链上结果，请稍候",
  },
  en: {
    Querying_on_chain_results_please_wait: "Querying on-chain results",
  },
  cn_traditional: {
    Querying_on_chain_results_please_wait: "正在查詢鏈上結果，請稍候",
  },
};
function Loading(props) {
  const { language } = props;
  const tips = languageContext[language];
  return (
    <div className={css.gainWindow}>
      <div className={css.gainBox}>
        {/* nopledge图 */}
        <div className={css.logImg}>
          <img src={loading} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>
          {tips.Querying_on_chain_results_please_wait}…
        </div>
      </div>
    </div>
  );
}

export default Loading;
