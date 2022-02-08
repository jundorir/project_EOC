import { makeAutoObservable, reaction, runInAction } from "mobx";
import {
  Market_QueryFee,
  Market_Material_UpShelf,
  Market_Material_DownShelf,
  Market_Material_Buy,
} from "@utils/web3Utils";
import chain from "../chain";
import { fetchMarketMaterialList } from "@common/api";
import { formateAddress, quiteAddress } from "@utils/common";

class MaterialMarket {
  saleHero = null;
  saleList = [];
  rare = "ALL";
  dropOrder = "price_up";
  dropCoin = "ALL";
  myOnSaleList = [];
  page = 1;
  pagesize = 100000;

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
  fee = 15;

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
        if (this.viewer === "market") {
          this.queryMarketMaterailList();
        }
        if (this.viewer === "mySale") {
          this.queryMyOnSaleMaterailList();
        }
      }
    );
  }

  setType(type) {
    this.type = type;
  }

  async init() {
    // await this.queryFee();
    await this.queryMarketMaterialList();
  }

  async queryFee() {
    const fee = await Market_QueryFee();
    runInAction(() => {
      this.fee = fee;
    });
  }

  setSaleHero(saleHero) {
    console.log("saleHero ===> ", saleHero);
    this.saleHero = saleHero;
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
          const materialKeyToken = formateAddress(item.prop_token)
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

        console.log("this.saleList ====>", this.saleList);
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
          const token = formateAddress(item.prop_token);
          return {
            id: "#" + item.id,
            order_id: item.order_id,
            materialKey: chain.currencyMap[token],
            materialNumber: item.prop_num,
            symbol:
              chain.currencyMap[token] === "GOLD"
                ? "EOCC"
                : chain.currencyMap[token] ?? "EOCC",
            price: item.price_total,
            dateTime: item.date_time,
            seller: quiteAddress(formateAddress(item.user)),
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

  setDropCoin(dropCoin) {
    this.dropCoin = dropCoin;
  }
  setDropOrder(dropOrder) {
    this.dropOrder = dropOrder;
  }
  setViewer(viewer) {
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

export default MaterialMarket;
