import { makeAutoObservable } from "mobx";
import { cn_simple, cn_traditional, en } from "@common/const/language";
class LanguageStore {
  checkedLanguage = "en";
  allLanguage = {
    cn_simple,
    cn_traditional,
    en,
  };
  idLanguge = {
    0: "cn_simple",
    1: "cn_traditional",
    2: "en",
    cn_simple: 0,
    cn_traditional: 1,
    en: 2,
  };
  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  init() {
    const config = localStorage.getItem("language");
    if (!config) {
      this.changeLanguage(2);
      return;
    } else {
      this.changeLanguage(this.idLanguge[JSON.parse(config)]);
    }
  }
  get language() {
    return this.allLanguage[this.checkedLanguage ?? "en"];
  }
  changeLanguage(value) {
    this.checkedLanguage = this.idLanguge[value];
    localStorage.setItem("language", JSON.stringify(this.idLanguge[value]));
  }
}

export default new LanguageStore();
