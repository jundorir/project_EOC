import React, { useEffect } from "react";
import UnionList from "./UnionList";
import UnionMain from "./UnionMain";
import { inject, observer } from "mobx-react";

function Union(props) {
  const { userStore } = props;
  // console.log("公会ID", userStore.guild_id);
  useEffect(() => {
    userStore.init();
    userStore.unionStore.init({ guild_id: userStore.guild_id });
  }, []);
  return userStore.guild_id - 0 > 0 ? <UnionMain /> : <UnionList />;
}

export default inject("userStore", "chain")(observer(Union));
