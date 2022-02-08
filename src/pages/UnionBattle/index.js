import classNames from "classnames";
import { useState, Fragment, useEffect } from "react";
import css from "./index.module.less";
import Sign from "./Sign";
import CityDetails from "./CityDetails";
// import Fighting from "./Fighting";
import { inject, observer } from "mobx-react";

// 公会战
function UnionBattle(props) {
  const { userStore, view } = props;
  const { unionbattleStore } = userStore;
  const [myCity, setMyCity] = useState(undefined);

  useEffect(() => {
    unionbattleStore.getCityList();
    unionbattleStore.getMySignUp();
    let interval = setInterval(() => {
      unionbattleStore.getCityList();
      userStore.queryUserInfo();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (userStore.guild_city_id > 0 && unionbattleStore.allCities.length > 0) {
      setMyCity(true);
      const data = unionbattleStore.allCities?.filter((item) => {
        return item.id - userStore.guild_city_id === 0;
      });
      const newData = data[0];
      // view.changeDisplayView("cityDetails");
      view.changeCity(newData, newData.name, newData.id);
    } else if (userStore.guild_city_id <= 0) {
      setMyCity(false);
    }
  }, [unionbattleStore.allCities.length, userStore.guild_city_id]);

  function renderView() {
    if (myCity === undefined) {
      return null;
    }

    if (myCity) {
      return (
        <CityDetails
          toCity={() => {
            setMyCity(false);
          }}
        />
      );
    }
    return (
      <Sign
        toCity={() => {
          setMyCity(true);
        }}
      />
    );
  }
  return (
    <Fragment>
      <div className={css.placeholder}></div>
      {renderView()}
    </Fragment>
  );
}

export default inject("userStore", "chain", "view")(observer(UnionBattle));
