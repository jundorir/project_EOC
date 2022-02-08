import { makeAutoObservable, reaction, runInAction } from "mobx";
import {
  battle_getFirstWinner,
  battle_needPower,
  battle_nowRound,
  battle_attack,
  Battle_Reward,
} from "@utils/web3Utils";
class BattleStore {
  user = null;
  list = [];
  nowRound = 0; //当前用户的的关数
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
    this.init();
  }
  init() {}
  // 获取当前关卡信息
  async getBttleDatasAsync(roundid) {
    try {
      const firstWinnerAsyncResult = await battle_getFirstWinner(roundid);
      const needPowerAsyncResult = await battle_needPower(roundid);
      const booksResult = roundid * 5;
      const coinResult = roundid * 5;
      runInAction(() => {
        this.list.push({
          firstWinner: firstWinnerAsyncResult, //关卡_首通的人
          needPower: needPowerAsyncResult, //首通需要的最低战力
          books: booksResult, //首通经验书
          coin: coinResult, //首通EOCC
        });
      });
    } catch (error) {
      return false;
    }
  }
  // 当前用户的的关数
  async nowRoundAsync() {
    try {
      const nowRoundResult = await battle_nowRound();
      runInAction(() => {
        this.nowRound = nowRoundResult - 0;
      });
    } catch (error) {
      console.log(error);
    }
  }
  // 开始战斗_
  async attackAsync(roundid) {
    const attackRusult = await battle_attack(roundid);
    if (attackRusult) {
      return attackRusult; //返回true
    }
    try {
    } catch (error) {
      return false;
    }
  }
  // 领取奖励
  async receiveAwardExpAndGold(expHex, goldHex, hoeHex, idx, sign) {
    const result = await Battle_Reward(expHex, goldHex, hoeHex, idx, sign);
    if (result) {
      this.user.materialStore.queryMaterialNumber("ExperienceBookPrimary");
      this.user.queryBalance("GOLD");
      return result; //返回true
    }
    try {
    } catch (error) {
      return false;
    }
  }
}
export default BattleStore;
