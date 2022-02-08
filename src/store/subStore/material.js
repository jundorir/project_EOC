import { makeAutoObservable, reaction, runInAction } from "mobx";
import { UseExpBook, UseSpiritDrug, sendToOther } from "@utils/web3Utils";
import chain from "../chain";
import { MaterialConfig } from "@common/const/define/Material";
import { computeWeiToSymbol } from "@utils/common";
class Material {
  ExperienceBookPrimary = 0; //初级经验书
  ExperienceBookIntermediate = 0; // 中级经验书
  ExperienceBookSenior = 0; // 高级经验书
  EmpireHoeToken = 0; // 开垦锄头
  GuildToken = 0; // 公会令牌
  SpiritDrug = 0; // 体力药水
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
  }

  init(
    EmpireHoeToken,
    GuildToken,
    SpiritDrug,
    ExperienceBookPrimary,
    ExperienceBookIntermediate,
    ExperienceBookSenior
  ) {
    this.EmpireHoeToken = EmpireHoeToken;
    this.GuildToken = GuildToken;
    this.SpiritDrug = SpiritDrug;
    this.ExperienceBookPrimary = ExperienceBookPrimary;
    this.ExperienceBookIntermediate = ExperienceBookIntermediate;
    this.ExperienceBookSenior = ExperienceBookSenior;
  }

  async queryMaterialNumber(keys) {
    // console.log("queryMaterialNumber ====> keys", keys);
    if (Array.isArray(keys)) {
      for (let i = 0; i < keys.length; i++) {
        // console.log(`正在获取 ===> ${keys[i]} 的数量`);
        const number = await chain.queryBalanceAsync(keys[i]);
        this.update({
          [keys[i]]: ~~computeWeiToSymbol(number),
        });
      }
    } else if (typeof keys === "string") {
      if (Object.hasOwnProperty.call(MaterialConfig, keys)) {
        // console.log(`正在获取 ===> ${keys} 的数量`);
        const number = await chain.queryBalanceAsync(keys);
        this.update({
          [keys]: ~~computeWeiToSymbol(number),
        });
      }
    } else {
      // console.log("error params", keys);
    }
  }

  update(obj) {
    for (const key in obj) {
      if (this.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }
  }

  // 使用道具
  consume(key, number) {
    if (this[key] && this[key] > number) {
      this[key] -= number;
    }
  }

  // 得到道具
  add(key, number = 1) {
    if (this[key] && this[key] > number) {
      this[key] += number;
    }
  }

  async useExpBook(hero, key, number) {
    // console.log("tokenId", hero);
    const result = await UseExpBook(hero.tokenId, key, number);
    if (result) {
      // 使用成功
      this.queryMaterialNumber(key);
      hero.addExp(MaterialConfig[key].exp * number);
    }
    return result;
  }

  async useSpiritDrug() {
    const result = await UseSpiritDrug();
    if (result) {
      this.queryMaterialNumber("SpiritDrug");
    }
    return result;
  }

  async sendMaterialToOther(otherAddress, number, materialKey) {
    const result = await sendToOther(otherAddress, number, materialKey);
    if (result) {
      this.queryMaterialNumber(materialKey);
    }
    return result;
  }
}

export default Material;
