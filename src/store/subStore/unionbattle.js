import { makeAutoObservable, reaction, runInAction } from "mobx";
import chain from "../chain";
import {
  getCityList,
  getSignUp,
  guildFighting,
  abandonedCity,
  getFightReward,
  getSignUpCountDown,
  getFightCountDown,
  getMySignUp,
  receiveAwardMmr,
} from "@common/api";
import { UnionBattle_signup, UnionBattle_getMMR } from "@utils/web3Utils";
class Unionbattle {
  cityyelu = [{}];
  cityjunshi = [{}];
  citybabilun = [{}];
  cityyadian = [{}];
  cityluoma = [{}];
  citydibisi = [{}];
  citydama = [{}];
  assembled = 0;
  membersList = [];
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
  }
  sign_up = 0;
  sign_up_end = 0;
  guild_fight = 0;
  guild_type = "";
  sign_up_time = 0;
  sign_up_end_time = 0;
  guild_fight_time = 0;
  fight_time = null;
  allCities = [];

  mySignUp = 0;
  init() {}
  async getCityList() {
    const result = await getCityList();
    // console.log("result城市", result);
    if (result) {
      runInAction(() => {
        this.allCities = result;
        this.cityyelu = result.filter((item) => item.name === "Jerusalem");
        this.cityjunshi = result.filter(
          (item) => item.name === "Constantinople"
        );
        this.citybabilun = result.filter((item) => item.name === "Babylon");
        this.cityyadian = result.filter((item) => item.name === "Athens");
        this.cityluoma = result.filter((item) => item.name === "Rome");
        this.citydibisi = result.filter((item) => item.name === "Thebes");
        this.citydama = result.filter((item) => item.name === "Damascus");
      });
    }
  }
  async getSignUpAsync() {
    const result = await getSignUp({
      user: chain.address,
      is_count: 1, //1==>返回人员总数
      sign: chain.token,
    });
    if (result >= 0) {
      console.log("参战成员人数", result);
      runInAction(() => {
        this.assembled = result;
      });
    }
  }
  async getSignUpMembersAsync() {
    const result = await getSignUp({
      user: chain.address,
      is_count: 0, //0==>获取参战成员
      sign: chain.token,
    });
    if (result) {
      console.log("参战成员", result);
      runInAction(() => {
        this.membersList = result.data;
      });
    }
  }
  async guildFightingAsync(city_id) {
    const result = await guildFighting({
      user: chain.address,
      sign: chain.token,
      city_id,
    });
    console.log("战斗结果", result);
    return result;
  }
  async abandonedCityAsync(city_id) {
    const result = await abandonedCity({
      user: chain.address,
      sign: chain.token,
      city_id,
    });
    console.log("弃城", result);
    return result;
  }

  //获取工会战报名倒计时(报名期间有开战倒计时)
  async getSignUpCountDownAsync() {
    const result = await getSignUpCountDown({
      user: chain.address,
      sign: chain.token,
    });
    // console.log("报名倒计时", result);
    runInAction(() => {
      this.sign_up_time = result.sign_up_time;
      this.sign_up_end_time = result.sign_up_end_time;
      this.guild_fight_time = result.guild_fight_time;
      this.sign_up = result.sign_up;
      this.sign_up_end = result.sign_up_end;
      this.guild_fight = result.guild_fight;
    });
  }
  //获取城池工会战倒计时
  async getFightCountDownAsync(city_id) {
    const result = await getFightCountDown({
      user: chain.address,
      sign: chain.token,
      city_id,
    });
    // console.log("获取城池工会战倒计时", result);
    if (result) {
      runInAction(() => {
        this.fight_time = result.guild_time;
        this.guild_type = result.guild_type;
      });
    }
  }
  // async getFightRewardAsync(city_id) {
  //   const result = await getFightReward({
  //     user: chain.address,
  //     sign: chain.token,
  //     city_id,
  //   });
  //   console.log("领取奖励结果", result);
  //   return result;
  // }
  async UnionBattle_signup() {
    const result = await UnionBattle_signup();
    console.log("公会战报名结果", result);
    return result;
  }
  async getMySignUp() {
    const result = await getMySignUp({
      user: chain.address,
      sign: chain.token,
    });
    runInAction(() => {
      this.mySignUp = result.type;
    });
  }
  async receiveAwardMmr() {
    const result = await receiveAwardMmr({
      user: chain.address,
      sign: chain.token,
    });
    console.log("领奖结果", result);
    return result;
  }
  // 链上领奖MMR
  async getMMR(data) {
    console.log(data);
    const result = await UnionBattle_getMMR(data);
    console.log("领奖结果", result);
    return result;
  }
}
export default Unionbattle;
