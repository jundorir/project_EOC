// 酒馆
import { makeAutoObservable } from "mobx";
import { EmpireMavernLottery } from "@utils/web3Utils";
class Tavern {
  constructor() {
    makeAutoObservable(this);
  }

  // todo 酒馆抽奖
  async lottery(type, showLoading) {
    return EmpireMavernLottery(type, showLoading);
  }
}

export default new Tavern();
