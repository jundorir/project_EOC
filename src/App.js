import { inject, observer } from "mobx-react";
import routes from "@common/const/routes";
import css from "./App.module.less";
// import { useSize } from "ahooks";
import AudioManager from "@components/AudioManager";
import Explain from "@assets/images/battle/icon_explain.png";
function App(props) {
  const {
    chain,
    view,
    languageStore: { language },
  } = props;
  function renderView() {
    if (!view.resourceLoading) {
      const ResourceLoading = routes.resourceLoading.components;
      return <ResourceLoading />;
    }
    if (!chain.address || !chain.token) {
      const Login = routes.login.components;
      return <Login />;
    }
    const route = routes[view.displayView];
    const V = route?.components ?? (() => null);
    let bottomStyle = {};
    if (view.displayView === "battle") {
      bottomStyle = { zIndex: 6 };
    }
    if (view.displayView !== "home") {
      return (
        <>
          <div className={css.middle}>
            <div className={css.top}></div>
            <V />
            <div className={css.bottom} style={bottomStyle}>
              <div className={css.route}>
                {view.displayTitle ||
                  language[route?.titleKey] ||
                  language[route?.title]}
                {route?.icon && (
                  <img
                    src={Explain}
                    alt=""
                    className={css.icon}
                    onClick={() => {
                      // console.log(route?.toRoute);
                      view.changeDisplayView(route?.toRoute);
                    }}
                  />
                )}
              </div>
              <div
                className={css.back}
                onClick={() => {
                  view.goBack();
                }}
              />
            </div>
          </div>
        </>
      );
    }
    return <V />;
  }

  return (
    <div id='app' className={css.app}>
      {renderView()}
      <AudioManager />
    </div>
  );
}

export default inject(
  "view",
  "chain",
  "audioStore",
  "languageStore"
)(observer(App));

// import { useSpring, animated } from "@react-spring/web";

// function App() {
//   const props = useSpring({
//     to: async (next, cancel) => {
//       await next({ opacity: 1, color: "#ffaaee" });
//       await next({ opacity: 0, color: "rgb(14,26,19)" });
//     },
//     from: { opacity: 0, color: 'blue' },
//     loop: true,
//   });
//   return <animated.div style={props}>I will fade in</animated.div>;
// }

// export default App;
