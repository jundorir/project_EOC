import { makeAutoObservable, reaction, runInAction } from "mobx";
import chain from "../chain";
import {} from "@common/api";
import IMG1 from "@assets/images/head/person/1.png";
import IMG2 from "@assets/images/head/person/2.png";
import IMG3 from "@assets/images/head/person/3.png";
import IMG4 from "@assets/images/head/person/4.png";
import IMG5 from "@assets/images/head/person/5.png";
import IMG6 from "@assets/images/head/person/6.png";
import IMG7 from "@assets/images/head/person/7.png";
import IMG8 from "@assets/images/head/person/8.png";
import IMG9 from "@assets/images/head/person/9.png";
import IMG10 from "@assets/images/head/person/10.png";
import IMG11 from "@assets/images/head/person/11.png";
import IMG12 from "@assets/images/head/person/12.png";
import None from "@assets/images/head/person/none.png";
import Union1 from "@assets/images/head/union/1.png";
import Union2 from "@assets/images/head/union/2.png";
import Union3 from "@assets/images/head/union/3.png";
import Union4 from "@assets/images/head/union/4.png";
import Union5 from "@assets/images/head/union/5.png";
import Union6 from "@assets/images/head/union/6.png";
import Union7 from "@assets/images/head/union/7.png";
import Union8 from "@assets/images/head/union/8.png";
import Union9 from "@assets/images/head/union/9.png";
class Head {
  data = {
    headArray: [
      IMG1,
      IMG2,
      IMG3,
      IMG4,
      IMG5,
      IMG6,
      IMG7,
      IMG8,
      IMG9,
      IMG10,
      IMG11,
      IMG12,
    ],
    unionArray: [
      Union1,
      Union2,
      Union3,
      Union4,
      Union5,
      Union6,
      Union7,
      Union8,
      Union9,
    ],
    none: [None],
  };
  unionHead = -1;
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
  }
  init() {}
  changeUnionHead(id) {
    this.unionHead = id;
  }
}
export default Head;
