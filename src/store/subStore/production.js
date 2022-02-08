import { makeAutoObservable, reaction, runInAction } from "mobx";
import {
  production_nowhave,
  production_totalOutput,
  production_unclaimed,
  production_withDraw,
  production_sendHero,
  production_sendHeros,
  production_openFarm,
  production_addFarm,
  production_removeHero,
} from "@utils/web3Utils";
import { signAddLand } from "@common/api";
import chain from "../chain";
class Production {
  nowhave = "0"; //现有农田
  totalOutput = "0.0000"; //派遣总产量
  unclaimed = "0.0000"; //待领取
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
    // this.init();
  }
  init() {
    this.getProductionDatasAsync();
  }
  getProductionDatas() {
    this.getProductionDatasAsync();
  }
  // 获取生产页面展示数据
  async getProductionDatasAsync() {
    const nowhaveResult = await production_nowhave();
    const totalOutputResult = await production_totalOutput();
    const production_unclaimedResult = await production_unclaimed();
    runInAction(() => {
      this.nowhave = nowhaveResult;
      this.totalOutput = totalOutputResult;
      this.unclaimed = production_unclaimedResult;
    });
  }
  // 领取奖励
  async withDrawAsync() {
    try {
      const withDrawAsyncResult = await production_withDraw();
      if (withDrawAsyncResult) {
        return withDrawAsyncResult;
      }
    } catch (error) {
      return false;
    }
  }

  // 开垦首次农田 --->调用此接口先获取锄头余额，>=1,可开垦。不需要授权
  async openFarmAsync() {
    try {
      const openFarmAsyncResult = await production_openFarm();
      if (openFarmAsyncResult) {
        return openFarmAsyncResult;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // 开垦多个农田 --->调用此接口先获取MMR余额，需要授权
  // amount---->开垦的农田数量number
  async addFarmAsync(openLandHex, roundHex, idx, sign) {
    try {
      const addFarmAsyncResult = await production_addFarm(openLandHex, roundHex, idx, sign);
      if (addFarmAsyncResult) {
        return addFarmAsyncResult;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async signAddLand(number) {
    try {
      const result = await signAddLand(chain.address, number, chain.token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
export default Production
