import { makeAutoObservable } from "mobx";
class View {
  // displayView = "home";
  // showTitle = "";
  view = [
    {
      displayView: "home",
      displayTitle: "",
    },
  ];

  goBackFunc = [];

  resourceLoading = false;

  citydata = {};
  cityname = "";
  cityId = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get displayView() {
    return this.view[this.view.length - 1].displayView;
  }

  get displayTitle() {
    return this.view[this.view.length - 1].displayTitle;
  }

  changeDisplayView(view, title) {
    this.view.push({
      displayView: view,
      displayTitle: title,
    });
  }

  goBack() {
    if (this.goBackFunc.length > 0) {
      const current = this.goBackFunc.pop();
      current();
      return;
    }
    this.view.pop();
  }

  setGoBack(func) {
    this.goBackFunc.push(func);
  }

  changeCity(citydata, cityname, cityId) {
    this.citydata = citydata;
    this.cityname = cityname;
    this.cityId = cityId;
  }

  setResourceLoading() {
    this.resourceLoading = true;
    // this.changeDisplayView("login");
  }
}

export default new View();
