import { inject, observer } from "mobx-react";
import css from "./PC.module.less";
function App(props) {
  

  return (
    <div className={css.app}>
      <div className={css.head} />
      <div className={css.useMobile}>
        <div className={css.mobile}></div>
        <div className={css.tip}>Tip</div>
        <div className={css.tip1}>
          Please log in using the mobile browser with wallet
        </div>
      </div>
    </div>
  );
}

export default App;
