import { computeWeiToSymbol } from "@utils/common";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import chain from "./chain";
import HeroStore from "./subStore/hero";
import MaterialStore from "./subStore/material";
import ProductionStore from "./subStore/production";
import BattleStore from "./subStore/battle";
import UnionStore from "./subStore/union";
import UnionbattleStore from "./subStore/unionbattle";
import MarketStore from "./subStore/market";
import HeadStore from "./subStore/head";
import { fetchUserInfo, modifyInfoAsync } from "@common/api";
import { queryAllBalanceOf } from "@utils/web3Utils";
import MaterialMarket from "./subStore/materialMarket";
class User {
  heroStore = null;
  materialStore = null;
  productionStore = null;
  battleStore = null;
  unionStore = null;
  token = null;
  headStore = null;
  unionbattleStore = null;
  marketStore = null;

  MMR_APPROVEMENT = "0"; // mmr 授权额度
  USDT_APPROVEMENT = "0"; // usdt 授权额度
  GUILDTOKEN_APPROVEMENT = "0"; // 公会令牌 授权额度
  MMR = "0"; //mmr 余额
  USDT = "0"; // usdt 余额
  GOLD = "0"; // EOCC 余额
  GUILDTOKEN = "0"; // 公会令牌 余额

  pp = 0; // 体力
  pp_time = 0;
  round_id = 1;
  guild_id = null;
  guild_city_id = 0;
  head_id = 0;
  nickname = "";
  power = 0;
  position = "";
  receive_exp = 0; //用户待领取经验
  receive_gold = 0; //用户待领取金币
  receive_hoe = 0; //用户待领取锄头
  constructor() {
    makeAutoObservable(this);

    this.heroStore = new HeroStore(this);
    this.materialStore = new MaterialStore(this);
    this.productionStore = new ProductionStore(this);
    this.battleStore = new BattleStore(this);
    this.unionStore = new UnionStore(this);

    this.headStore = new HeadStore(this);
    this.unionbattleStore = new UnionbattleStore(this);
    this.marketStore = new MarketStore(this);
    this.materialMarketStore = new MaterialMarket(this);

    // reaction(
    //   () => [chain.address, chain.token],
    //   ([currentAddress, currentToken]) => {
    //     if (currentAddress && currentToken) {
    //       this.startInit();
    //     }
    //   }
    // );
  }

  // 初始化用户信息
  async startInit() {
    // console.log("------ 开始初始化用户信息 ------");
    //todo 获取用户信息
    await this.init();
    //todo 获取英雄信息
    await this.heroStore.init();
    //todo 获取用户仓库信息

    //todo 获取用户农场信息
    await this.productionStore.init();
    //todo 获取用户工会信息
    await this.unionStore.init({ guild_id: this.guild_id });

    // 获取所有用户资产数据
    await this.queryAllBalance();
    await this.marketStore.init();
    await this.materialMarketStore.init();

    // console.log("------ 完成初始化用户信息 ------");
  }

  async init() {
    const user = await this.queryUserInfo();
    if (!user) return;
    this.queryAllowance("USDT");
    this.queryAllowance("MMR");
  }

  async queryUserInfo() {
    const userInfo = await fetchUserInfo(chain.address, chain.token);
    // console.log("个人信息", userInfo);
    if (!userInfo) return;
    const {
      user, //	用户地址
      pp, // integer	 体力
      power, //	integer	战力
      exp, //	integer	经验
      gold, //	string	EOCC
      pp_time, //	string	体力时间
      newcooldown, //	string	药水时间
      round_id,
      guild_id,
      guild_city_id,
      head,
      nickname,
      position, //职位 2会长
      hoe, //锄头
    } = userInfo;
    runInAction(() => {
      this.pp = pp;
      this.pp_time = (pp_time + 1200) * 1000;
      this.round_id = round_id;
      this.guild_id = guild_id;
      this.guild_city_id = guild_city_id;
      this.head_id = head;
      this.nickname = nickname;
      this.power = power;
      this.position = position;
      this.receive_gold = parseInt(gold);
      this.receive_exp = parseInt(exp);
      this.receive_hoe = parseInt(hoe);
    });
    // this.queryBalance("USDT");
    // this.queryBalance("MMR");
    // this.queryBalance("GOLD");
    // this.queryBalance("GUILDTOKEN");
    // this.queryAllowance("USDT");
    // this.queryAllowance("MMR");
    // this.queryAllowance("GUILDTOKEN");
    return userInfo;
  }

  // 预加载数据
  preload() {}

  async queryAllowance(symbol) {
    const allowance = await chain.queryAllowanceAsync({ symbol });
    runInAction(() => {
      this[`${symbol}_APPROVEMENT`] = allowance;
    });
  }

  async toApprove(symbol) {
    const result = await chain.toApprove({ symbol });
    runInAction(() => {
      const { status, approvement } = result;
      if (status) {
        this[`${symbol}_APPROVEMENT`] = approvement;
      }
    });
    return result;
  }

  async queryBalance(symbol) {
    const balance = await chain.queryBalanceAsync(symbol);
    runInAction(() => {
      this[symbol] = computeWeiToSymbol(balance, 4);
    });
  }

  async modifyInfo(data) {
    try {
      const res = await modifyInfoAsync(data);
      if (res) {
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async queryAllBalance() {
    const [
      MMR,
      USDT,
      GOLD,
      EmpireHoeToken,
      GUILDTOKEN,
      SpiritDrug,
      ExperienceBookPrimary,
      ExperienceBookIntermediate,
      ExperienceBookSenior,
    ] = await queryAllBalanceOf();
    runInAction(() => {
      this.USDT = computeWeiToSymbol(USDT, 4);
      this.MMR = computeWeiToSymbol(MMR, 4);
      this.GOLD = computeWeiToSymbol(GOLD, 4);
      this.GUILDTOKEN = computeWeiToSymbol(GUILDTOKEN, 4);
    });
    this.materialStore.init(
      ~~computeWeiToSymbol(EmpireHoeToken),
      ~~computeWeiToSymbol(GUILDTOKEN),
      ~~computeWeiToSymbol(SpiritDrug),
      ~~computeWeiToSymbol(ExperienceBookPrimary),
      ~~computeWeiToSymbol(ExperienceBookIntermediate),
      ~~computeWeiToSymbol(ExperienceBookSenior)
    );
  }
}

export default new User();
