import { makeAutoObservable } from "mobx";
import {
  HeroStatus,
  HeroRarity,
  Max_Battle_Hero_Number_Limit,
  Hero_Setting,
} from "@common/const/define/hero";
class HeroModel {
  hp = 0;
  atk = 0;
  def = 0;
  power = 0;
  heroId = 0;
  images = 0;
  title = 0;
  key = "NONE";
  // Lv = 1;
  starLv = 1;
  rarity = 5;
  exp = 0;
  id = 0;
  status = 0;
  head_url = '';
  uri = '';
  store = null;
  constructor(
    store,
    {
      atk, // 攻击力
      def, // 防御
      power, // 战斗力
      heroId, // 英雄id
      images, // 英雄图片
      title, // 英雄名称
      key,
      starLv, // 星级
      rarity, // 稀有度
      exp, // 当前经验值
      id,
      tokenId,
      status,
      baseId,
      lease_end_time,
      next_level_exp,
      head_url,
      uri,
    }
  ) {
    makeAutoObservable(this, {
      store: false,
    });
    this.store = store;
    this.atk = atk;
    this.def = def;
    this.power = power;
    this.heroId = heroId;
    this.images = images;
    this.title = title;
    this.key = key;
    // this.Lv = Lv;
    this.starLv = starLv;
    this.rarity = rarity;
    this.exp = exp;
    this.id = id;
    this.status = status;
    this.baseId = baseId;
    this.tokenId = tokenId;
    this.lease_end_time = lease_end_time;
    this.next_level_exp = next_level_exp;
    this.uri = uri;
    this.head_url = head_url;
  }

  get Lv() {
    if (this.exp === 0) return 1;
    return Math.min(
      Math.floor(Math.sqrt(this.exp / 500)) + 1,
      Hero_Setting[this.rarity].Max_Hero_Level_Limit
    );
  }

  delete() {
    this.store.removeHero(this);
  }

  update(obj) {
    for (const key in obj) {
      if (this.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }
  }

  addExp(exp) {
    this.exp = this.exp + exp;
  }
}

export default HeroModel;
