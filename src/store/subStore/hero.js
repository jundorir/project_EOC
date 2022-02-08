import { makeAutoObservable, reaction, runInAction } from "mobx";
import chain from "../chain";
import { HeroStatus } from "@common/const/define/hero";
import HeroModel from "../Model/HeroModel";
import {
  fetchHeroConfigList,
  fetchUserHeroList,
  fetchFormationList,
  fetchUserHeroDetail,
} from "@common/api";
import {
  UpgradeHero,
  resetCard,
  HeroSynthesis,
  production_sendHero,
  production_sendHeros,
  UpdateHeroSlotBatch,
  production_removeHeros,
  Hero_Transfer,
} from "@utils/web3Utils";
class Hero {
  hero = null;
  heroList = []; // 用户拥有的英雄列表
  config = {};
  order = "Lv";
  battleHeroFormationIds = [null, null, null, null, null]; // 英雄上阵情况
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
    this.preload();
  }

  setHero(hero) {
    this.hero = hero;
  }

  get battleHeroFormation() {
    // console.log('battleHeroFormationIds ====>', this.battleHeroFormationIds)
    // console.log('battleHero ====>', this.battleHero)
    return this.battleHeroFormationIds.map(
      (item) => this.battleHero.find((i) => i.tokenId === item) ?? null
    );
  }

  get battleHero() {
    return this.heroList.filter((item) => HeroStatus.BATTLE === item.status);
  }

  get restHero() {
    return this.heroList.filter((item) => HeroStatus.REST === item.status);
  }

  get reclamationHero() {
    return this.heroList.filter(
      (item) => HeroStatus.RECLAMATION === item.status
    );
  }

  async init() {
    // todo 获取基本卡牌属性列表
    // sort ===> rarity ===> starLv ===> Lv
    await this.queryHeroList();
    // 查询上阵情况
    await this.queryFormationInfo();
  }

  removeHero(hero) {
    this.heroList.splice(this.heroList.indexOf(hero), 1);
  }

  addHero(hero) {
    this.heroList.push(hero);
    this.setOrder();
  }

  // 变阵
  async updateBattleFormation(list) {
    // todo 进行链上的 上阵确认

    let diffSlotArray = [];
    let oldTokenIdArray = [];
    let newTokenIdArray = [];

    for (let i = 0; i < 5; i++) {
      const currentNow = list[i];
      if (currentNow !== this.battleHeroFormation[i]) {
        diffSlotArray.push(i + 1);
        oldTokenIdArray.push(this.battleHeroFormation[i]?.tokenId ?? 0);
        newTokenIdArray.push(currentNow?.tokenId ?? 0);
      }
    }
    const result = await UpdateHeroSlotBatch(
      diffSlotArray,
      oldTokenIdArray,
      newTokenIdArray
    );
    // 更新herolist
    if (result) {
      await this.queryHeroList();
      this.queryFormationInfo();
    }
  }
  // 派遣单个英雄 @tokenID--->英雄ID数字number
  async sendHeroAsync(list) {
    try {
      const sendHerosAsyncResult = await production_sendHeros(
        list.map((item) => item.tokenId)
      );
      if (sendHerosAsyncResult) {
        list.forEach((element) => {
          if (element.status === HeroStatus.REST) {
            element.update({
              status: HeroStatus.RECLAMATION,
            });
          }
        });
        return sendHerosAsyncResult;
      }
    } catch (error) {
      return false;
    }
  }
  // 移出英雄 @tokenID--->英雄ID数字number
  async removeHeroAsync(list) {
    if (!list.length) {
      return;
    }
    try {
      const removeHerosAsyncResult = await production_removeHeros(
        list.map((item) => item.tokenId)
      );
      if (removeHerosAsyncResult) {
        
        list.forEach((element) => {
          if (element.status === HeroStatus.RECLAMATION) {
            element.update({
              status: HeroStatus.REST,
            });
          }
        });
        return removeHerosAsyncResult;
      }
    } catch (error) {
      return false;
    }
  }
  // 合成
  async synthesis(list) {
    const result = await HeroSynthesis(
      this.hero.tokenId,
      list.map((item) => item.tokenId),
      this.hero.rarity
    );

    if (result) {
      list.forEach((element) => {
        element.delete();
      });

      await this.queryHeroDetail(result.tokenId);
      this.user.queryBalance("GOLD");

      return result;
    } else {
      return result;
    }

    // this.heroList.push(new HeroModel(this, result.hero));
  }

  // 升星
  async starUp(materialHero) {
    // todo 链上升星

    const result = await UpgradeHero(this.hero.tokenId, materialHero.tokenId);
    if (result) {
      await this.queryHeroDetail(this.hero.tokenId);
      this.user.queryBalance("GOLD");

      materialHero.delete();
      return result;
    } else {
      return result;
    }
  }

  setOrder(order = this.order) {
    if (this.order !== order) this.order = order;
    const sortType = [...new Set([order, "Lv", "rarity", "starLv", "baseId"])];
    this.heroList
      .sort((a, b) => a[sortType[3]] - b[sortType[3]])
      .sort((a, b) => b[sortType[2]] - a[sortType[2]])
      .sort((a, b) => b[sortType[1]] - a[sortType[1]])
      .sort((a, b) => b[sortType[0]] - a[sortType[0]]);
  }

  async preload() {
    this.queryHeroConfig();
  }

  async queryHeroConfig() {
    const config = await fetchHeroConfigList();
    runInAction(() => {
      this.config = config;
    });
  }

  createHero(baseId, tokenId) {
    const hero = this.createBaseHero(baseId, tokenId);
    this.addHero(hero);
    return hero;
  }

  createBaseHero(baseId, tokenId) {
    const model = this.config[baseId - 1];
    const hero = new HeroModel(this, {
      heroId: baseId, // 英雄id
      key: baseId,
      baseId: baseId,
      title: model.heroName, // 英雄名称
      exp: 0,
      starLv: 1,
      rarity: model.herolevel,
      status: 0,
      tokenId,
      power: model.basepower, // 战斗力
      atk: model.ce, // 攻击力
      def: model.hp, // 防御
      images: model.uri,
      id: tokenId,
      uri: model.uri,
      head_url: model.head_url,
    });
    return hero;
  }

  async resetHero() {
    const result = await resetCard(this.hero.tokenId);
    if (result) {
      // 还原成功
      // 移除英雄
      // this.removeHero(this.hero);
      // this.hero = null;
      this.queryHeroList();
    }
    return result;
  }

  async queryHeroList() {
    const list = await fetchUserHeroList(chain.address, chain.token);
    if (list) {
      runInAction(() => {
        this.heroList = list.map((item) => {
          return new HeroModel(this, {
            atk: item.aggressivity, // 攻击力
            def: item.hp, // 防御
            power: item.ce, // 战斗力
            heroId: item.base_id, // 英雄id
            title: item.heroName, // 英雄名称
            key: item.base_id,
            baseId: item.base_id,
            // Lv: item.lv, // 等级
            starLv: parseInt(item.intensify) + 1, // 星级
            rarity: parseInt(item.rarity), // 稀有度
            exp: item.exp, // 当前经验值
            id: item.token_id,
            tokenId: item.token_id,
            status: parseInt(item.status),
            lease_end_time: item.lease_end_time, // 租赁结束时间
            next_level_exp: item.next_level_exp, // 下一级所需经验
            uri: item.uri, //英雄图片
            head_url: item.head_url, // 英雄头像
          });
        });
        this.setOrder();
      });
    }
  }

  async queryFormationInfo() {
    const battleHeroFormationIds = await fetchFormationList(
      chain.address,
      chain.token
    );
    if (battleHeroFormationIds) {
      runInAction(() => {
        this.battleHeroFormationIds = battleHeroFormationIds;
      });
    }
  }

  async queryHeroDetail(tokenId) {
    const item = await fetchUserHeroDetail(chain.address, chain.token, tokenId);
    runInAction(() => {
      this.hero = new HeroModel(this, {
        atk: item.aggressivity, // 攻击力
        def: item.hp, // 防御
        power: item.ce, // 战斗力
        heroId: item.base_id, // 英雄id
        title: item.heroName, // 英雄名称
        key: item.base_id,
        baseId: item.base_id,
        // Lv: item.lv, // 等级
        starLv: parseInt(item.intensify) + 1, // 星级
        rarity: parseInt(item.rarity), // 稀有度
        exp: item.exp, // 当前经验值
        id: item.token_id,
        tokenId: item.token_id,
        status: parseInt(item.status),
        lease_end_time: item.lease_end_time, // 租赁结束时间
        next_level_exp: item.next_level_exp, // 下一级所需经验
        uri: item.uri, //英雄图片
        head_url: item.head_url, // 英雄头像
      });
    });
  }

  async sendHeroToOther(address) {
    const result = await Hero_Transfer(address, this.hero.tokenId);

    return result;
  }
}

export default Hero;
