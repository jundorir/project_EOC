import { makeAutoObservable, reaction, runInAction } from "mobx";
import {
  Market_Hero_UpShelf,
  Market_Hero_DownShelf,
  Market_Hero_Buy,
  Market_Hero_Approve,
  Market_isApprovedForAll,
  Market_ApprovedForAll,
  Market_QueryFee,
  Market_Material_UpShelf,
  Market_Material_DownShelf,
  Market_Material_Buy,
  Market_Material_QueryFee,
} from "@utils/web3Utils";
import chain from "../chain";
import { fetchMarketHeroList, fetchMarketMaterialList } from "@common/api";
import { formateAddress, quiteAddress } from "@utils/common";
import HeroModel from "../Model/HeroModel";
import { HeroRarity } from "@common/const/define/hero";

class Market {
  saleHero = null;
  saleMaterial = null;
  saleList = [];
  rare = "ALL";
  dropOrder = "price_up";
  dropCoin = "ALL";
  page = 1;
  isSearch = false;
  pagesize = 100000;
  MMR_APPROVEMENT = "0"; // mmr 给市场的授权额度
  USDT_APPROVEMENT = "0"; // usdt 给市场的授权额度
  GOLD_APPROVEMENT = "0"; // gold 给市场授权额度

  MMR_MaterialMarket_APPROVEMENT = "0"; // mmr 给道具市场的授权额度
  USDT_MaterialMarket_APPROVEMENT = "0"; // usdt 给道具市场的授权额度
  GOLD_MaterialMarket_APPROVEMENT = "0"; // gold 给道具市场授权额度

  ExperienceBookPrimary_MaterialMarket_APPROVEMENT = "0"; //初级经验书授权额度
  ExperienceBookIntermediate_MaterialMarket_APPROVEMENT = "0"; //中级经验书授权额度
  ExperienceBookSenior_MaterialMarket_APPROVEMENT = "0"; //高级经验书授权额度
  EmpireHoeToken_MaterialMarket_APPROVEMENT = "0"; //锄头授权额度
  GuildToken_MaterialMarket_APPROVEMENT = "0"; //工会令牌授权额度
  SpiritDrug_MaterialMarket_APPROVEMENT = "0"; //体力药水授权额度

  viewer = "market";
  isApproveToMarket = false;
  fee = 15;
  materialFee = 15;

  coinList = [
    { text: "ALL", value: "ALL" },
    { text: "EOCC", value: "GOLD" },
    { text: "USDT", value: "USDT" },
    { text: "MMR", value: "MMR" },
  ];
  user = null;

  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
    reaction(
      () => [this.rare, this.dropOrder, this.dropCoin],
      () => {
        if (this.rare === "Props" && !this.isSearch) {
          if (this.viewer === "market") {
            this.queryMarketMaterialList();
          }
          if (this.viewer === "mySale") {
            this.queryMyOnSaleMaterialList();
          }
          this.isSearch = false;
        } else if (this.rare !== "Props" && !this.isSearch) {
          if (this.viewer === "market") {
            this.queryMarketHeroList();
          }
          if (this.viewer === "mySale") {
            this.queryMyOnSaleHeroList();
          }
          this.isSearch = false;
        }
      }
    );
  }

  async init() {
    await this.queryMarketIsApprove();
    await this.queryFee();
  }

  async queryFee() {
    const fee = await Market_QueryFee();
    const materialFee = await Market_Material_QueryFee();
    runInAction(() => {
      this.fee = fee;
      this.materialFee = materialFee;
    });
  }

  setSaleHero(saleHero) {
    console.log("saleHero ===> ", saleHero);
    this.saleHero = saleHero;
  }
  setSaleMaterial(saleMaterial) {
    console.log("saleMaterial ===> ", saleMaterial);
    this.saleMaterial = saleMaterial;
  }
  async toApprove(symbol) {
    const result = await chain.toApprove({
      symbol,
      type: "market",
    });
    runInAction(() => {
      const { status, approvement } = result;
      if (status) {
        this[`${symbol}_APPROVEMENT`] = approvement;
      }
    });
    return result;
  }

  async queryAllowance(symbol) {
    const allowance = await chain.queryAllowanceAsync({
      symbol,
      type: "market",
    });
    runInAction(() => {
      this[`${symbol}_APPROVEMENT`] = allowance;
    });
  }

  async upShelfHero(hero, price, symbol) {
    const result = await Market_Hero_UpShelf(hero.tokenId, price, symbol);
    if (result) {
      hero.delete();
    }

    return result;
  }

  async downShelfHero(tokenId) {
    const result = await Market_Hero_DownShelf(tokenId);
    if (result) {
      this.queryMarketHeroList();
      this.user.heroStore.queryHeroList();
    }
    return result;
  }

  async buyHero(tokenId) {
    const result = await Market_Hero_Buy(tokenId);
    if (result) {
      this.user.heroStore.queryHeroList();
    }

    return result;
  }

  async queryMarketIsApprove() {
    const isApprove = await Market_isApprovedForAll();
    runInAction(() => {
      this.isApproveToMarket = isApprove;
    });
  }

  async approveHeroToMarket() {
    const result = await Market_ApprovedForAll();
    if (result) {
      this.queryMarketIsApprove();
    }

    return result;
  }

  async queryMarketHeroList(keyword) {
    //  http://dev-empire.mmr.finance:81/api.html
    const list = await fetchMarketHeroList({
      keyword: keyword,
      page: this.page,
      pagesize: this.pagesize,
      status: 0,
      sign: chain.token,
      rarity: this.rare === "ALL" ? null : HeroRarity[this.rare],
      power_sort:
        this.dropOrder === "power_up"
          ? 1
          : this.dropOrder === "power_down"
          ? 2
          : null,
      price_sort:
        this.dropOrder === "price_up"
          ? 1
          : this.dropOrder === "price_down"
          ? 2
          : null,
      user: chain.address,
      token: this.dropCoin === "ALL" ? null : chain.currencyMap[this.dropCoin],
    });

    if (list.data) {
      runInAction(() => {
        this.saleList = list.data.map((item) => {
          const token = formateAddress(item.token);
          const { hero } = item;
          return {
            id: "#" + item.id,
            symbol:
              chain.currencyMap[token] === "GOLD"
                ? "EOCC"
                : chain.currencyMap[token] ?? "EOCC",
            hero: new HeroModel(this, {
              atk: hero.aggressivity, // 攻击力
              def: hero.hp, // 防御
              power: hero.ce, // 战斗力
              heroId: hero.base_id, // 英雄id
              title: hero.heroName, // 英雄名称
              key: hero.base_id,
              baseId: hero.base_id,
              // Lv: item.lv, // 等级
              starLv: parseInt(hero.intensify) + 1, // 星级
              rarity: parseInt(hero.rarity), // 稀有度
              exp: hero.exp, // 当前经验值
              id: hero.token_id,
              tokenId: hero.token_id,
              status: parseInt(hero.status),
              lease_end_time: hero.lease_end_time, // 租赁结束时间
              next_level_exp: hero.next_level_exp, // 下一级所需经验
              uri: hero.uri, //英雄图片
              head_url: hero.head_url, // 英雄头像
            }),
            price: item.price,
            dateTime: item.date_time,
            seller: quiteAddress(formateAddress(item.user)),
            origin_seller: formateAddress(item.user),
          };
        });
      });
    }
  }

  async queryMyOnSaleHeroList() {
    //  http://dev-empire.mmr.finance:81/api.html
    const list = await fetchMarketHeroList({
      page: 1,
      pagesize: this.pagesize,
      status: 0,
      sign: chain.token,
      user: chain.address,
      rarity: this.rare === "ALL" ? null : HeroRarity[this.rare],
      my_type: 1,
      power_sort:
        this.dropOrder === "power_up"
          ? 1
          : this.dropOrder === "power_down"
          ? 2
          : null,
      price_sort:
        this.dropOrder === "price_up"
          ? 1
          : this.dropOrder === "price_down"
          ? 2
          : null,
      token: this.dropCoin === "ALL" ? null : chain.currencyMap[this.dropCoin],
    });

    if (list.data) {
      runInAction(() => {
        this.saleList = list.data.map((item) => {
          const token = formateAddress(item.token);
          const { hero } = item;
          return {
            id: "#" + item.id,
            symbol:
              chain.currencyMap[token] === "GOLD"
                ? "EOCC"
                : chain.currencyMap[token] ?? "EOCC",
            hero: new HeroModel(this, {
              atk: hero.aggressivity, // 攻击力
              def: hero.hp, // 防御
              power: hero.ce, // 战斗力
              heroId: hero.base_id, // 英雄id
              uri: hero.uri, // 英雄图片
              head_url: hero.head_url,
              title: hero.heroName, // 英雄名称
              key: hero.base_id,
              baseId: hero.base_id,
              // Lv: item.lv, // 等级
              starLv: parseInt(hero.intensify) + 1, // 星级
              rarity: parseInt(hero.rarity), // 稀有度
              exp: hero.exp, // 当前经验值
              id: hero.token_id,
              tokenId: hero.token_id,
              status: parseInt(hero.status),
              lease_end_time: hero.lease_end_time, // 租赁结束时间
              next_level_exp: hero.next_level_exp, // 下一级所需经验
            }),
            price: item.price,
            dateTime: item.date_time,
            seller: quiteAddress(formateAddress(item.user)),
            origin_seller: formateAddress(item.user),
          };
        });
      });
    }
  }

  async queryMarketMaterialList(keyword) {
    const sortType = {
      price_up: {
        price_sort: 1,
      },
      price_down: {
        price_sort: 2,
      },
      total_price_sort_up: {
        total_price_sort: 1,
      },
      total_price_sort_down: {
        total_price_sort: 2,
      },
      num_sort_up: {
        num_sort: 1,
      },
      num_sort_down: {
        num_sort: 2,
      },
    };
    const list = await fetchMarketMaterialList({
      user: chain.address,
      page: this.page,
      pagesize: this.pagesize,
      status: 0,
      my_type: 0,
      token: this.dropCoin === "ALL" ? null : chain.currencyMap[this.dropCoin],
      sign: chain.token,
      ...sortType[this.dropOrder],
      keyword,
    });

    if (list.data) {
      runInAction(() => {
        this.saleList = list.data.map((item) => {
          const token = formateAddress(item.token);
          const materialKeyToken = formateAddress(item.prop_token);
          return {
            id: "#" + item.id,
            order_id: item.order_id,
            materialKey: chain.currencyMap[materialKeyToken],
            materialNumber: item.prop_num,
            symbol:
              chain.currencyMap[token] === "GOLD"
                ? "EOCC"
                : chain.currencyMap[token] ?? "EOCC",
            price: item.price_total,
            dateTime: item.date_time,
            seller: quiteAddress(formateAddress(item.user)),
            origin_seller: formateAddress(item.user),
          };
        });
      });
    }
  }

  async queryMyOnSaleMaterialList() {
    const sortType = {
      price_up: {
        price_sort: 1,
      },
      price_down: {
        price_sort: 2,
      },
      total_price_sort_up: {
        total_price_sort: 1,
      },
      total_price_sort_down: {
        total_price_sort: 2,
      },
      num_sort_up: {
        num_sort: 1,
      },
      num_sort_down: {
        num_sort: 2,
      },
    };
    const list = await fetchMarketMaterialList({
      user: chain.address,
      page: this.page,
      pagesize: this.pagesize,
      status: 0,
      my_type: 1,
      token: this.dropCoin === "ALL" ? null : chain.currencyMap[this.dropCoin],
      sign: chain.token,
      ...sortType[this.dropOrder],
    });

    if (list.data) {
      runInAction(() => {
        this.saleList = list.data.map((item) => {
          const token = formateAddress(item.token);
          const materialKeyToken = formateAddress(item.prop_token);
          return {
            id: "#" + item.id,
            order_id: item.order_id,
            materialKey: chain.currencyMap[materialKeyToken],
            materialNumber: item.prop_num,
            symbol:
              chain.currencyMap[token] === "GOLD"
                ? "EOCC"
                : chain.currencyMap[token] ?? "EOCC",
            price: item.price_total,
            dateTime: item.date_time,
            seller: quiteAddress(formateAddress(item.user)),
            origin_seller: formateAddress(item.user),
          };
        });
      });
    }
  }

  async queryMaterialAllowance(symbol) {
    const allowance = await chain.queryAllowanceAsync({
      symbol,
      type: "materialMarket",
    });
    runInAction(() => {
      this[`${symbol}_MaterialMarket_APPROVEMENT`] = allowance;
    });
  }

  setRare(rare, search = false) {
    if (
      (this.rare === "Props" && rare !== "Props") ||
      (rare === "Props" && this.rare !== "Props")
    ) {
      this.saleList = [];
    }
    this.rare = rare;
    this.isSearch = search;
  }
  setDropCoin(dropCoin) {
    this.dropCoin = dropCoin;
  }
  setDropOrder(dropOrder) {
    this.dropOrder = dropOrder;
  }
  setViewer(viewer) {
    this.saleList = [];
    this.viewer = viewer;
  }

  async toApproveMaterialMarket(symbol) {
    const result = await chain.toApprove({
      symbol,
      type: "materialMarket",
    });
    runInAction(() => {
      const { status, approvement } = result;
      if (status) {
        this[`${symbol}_MaterialMarket_APPROVEMENT`] = approvement;
      }
    });
    return result;
  }

  async upShelfMaterial(materialKey, materialAmount, price, symbol) {
    const result = await Market_Material_UpShelf(
      materialKey,
      materialAmount,
      price,
      symbol
    );

    if (result) {
      // 更新上架道具数据
      this.user.materialStore.queryMaterialNumber(materialKey);
    }

    return result;
  }

  async downShelfMaterial(orderId, materialKey) {
    const result = await Market_Material_DownShelf(orderId);
    if (result) {
      this.queryMarketMaterialList();
      // 更新上架道具数据
      this.user.materialStore.queryMaterialNumber(materialKey);
    }
    return result;
  }

  async buyMaterial(orderId, materialKey) {
    const result = await Market_Material_Buy(orderId);
    if (result) {
      // 更新上架道具数据
      this.user.materialStore.queryMaterialNumber(materialKey);
    }

    return result;
  }
}

export default Market;
