import { makeAutoObservable, reaction, runInAction } from "mobx";
import { curChainId } from "@common/const/env";
import loading from "@components/ChainLoading";
import { fetchContractAddress, login } from "@common/api";
import {
  getAccounts,
  queryBalance,
  queryAllowance,
  isApproveFlow,
  enable,
  requestSignuature,
} from "@utils/web3Utils";
import { quiteAddress } from "@utils/common";

/**
 * 普通行为与链上进行交互
 */
class Chain {
  address = "";
  token = "";
  chainId = curChainId;
  initEnd = false;

  contractAddress = {};
  currencyMap = {};
  materialMap = {};

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.chainId,
      (current) => {
        if (current === undefined) {
          this.chainId = window.ethereum?.chainId;
        } else if (parseInt(current) !== parseInt(curChainId)) {
          loading.showNetWorkError();
        } else {
          loading.hidden();
        }
      }
    );

    this.init();
  }

  async init() {
    // 注册监听器
    this.registerListener();
    // 获取链id
    this.chainId = window.ethereum?.chainId;
    // 从服务器获取合约地址
    await this.queryContractAddress();
    // 获取用户地址
    const account = await this.getNowAccounts();

    if (account) {
      // 获取到地址之后 可以进行初始化
    }

    this.initEnd = true;
  }

  registerListener() {
    window.ethereum?.on("chainChanged", (newChainId) => {
      runInAction(() => {
        this.chainId = newChainId;
      });
    });
    window.ethereum?.on("accountsChanged", (accounts) => {
      let newAddress = "";
      if (accounts.length > 0) {
        newAddress = accounts[0];
      }
      runInAction(() => {
        if (this.address !== newAddress) {
          if (!!this.address) {
            window.location.reload();
          } else {
            this.address = newAddress;
          }
        }
      });
    });
    window.ethereum?.on("connect", (connectInfo) => {
      runInAction(() => {
        this.chainId = connectInfo.chainId;
      });
    });
  }

  async queryContractAddress() {
    const list = await fetchContractAddress();

    runInAction(() => {
      let contractTempAddress = {};

      list.forEach((element) => {
        contractTempAddress[element.name] = element.address;
      });

      let materialTempMap = {
        ExperienceBookPrimary: contractTempAddress.ExpBookA,
        ExperienceBookIntermediate: contractTempAddress.ExpBookB,
        ExperienceBookSenior: contractTempAddress.ExpBookC,
        EmpireHoeToken: contractTempAddress.EmpireHoeToken,
        GuildToken: contractTempAddress.GuildToken,
        SpiritDrug: contractTempAddress.SpiritDrug,
        [contractTempAddress.ExpBookA]: "ExperienceBookPrimary",
        [contractTempAddress.ExpBookB]: "ExperienceBookIntermediate",
        [contractTempAddress.ExpBookC]: "ExperienceBookSenior",
        [contractTempAddress.EmpireHoeToken]: "EmpireHoeToken",
        [contractTempAddress.GuildToken]: "GuildToken",
        [contractTempAddress.SpiritDrug]: "SpiritDrug",
      };

      let currencyTempMap = {
        MMR: contractTempAddress.mmr,
        USDT: contractTempAddress.usdt,
        GOLD: contractTempAddress.EOCCToken,
        GUILDTOKEN: contractTempAddress.GuildToken,
        [contractTempAddress.EOCCToken]: "GOLD",
        [contractTempAddress.usdt]: "USDT",
        [contractTempAddress.mmr]: "MMR",
        [contractTempAddress.GuildToken]: "GUILDTOKEN",
        ...materialTempMap,
      };

      this.contractAddress = contractTempAddress;
      this.currencyMap = currencyTempMap;
      this.materialMap = materialTempMap;

      console.log("this.contractAddress ===> ", this.contractAddress);
      console.log("this.currencyMap ===> ", this.currencyMap);
    });
  }

  async getNowAccounts() {
    const accounts = await getAccounts();
    if (accounts?.length > 0) {
      runInAction(() => {
        this.address = accounts[0];
      });
    }
    return accounts?.[0];
  }

  async queryBalanceAsync(symbol) {
    const balace = await queryBalance(symbol);
    return balace;
  }

  async queryAllowanceAsync(symbol) {
    const allowance = await queryAllowance(symbol);
    return allowance;
  }

  async toApprove(symbol) {
    const result = await isApproveFlow(symbol);
    return result;
  }

  login() {
    return enable();
  }

  get quiteAddress() {
    // console.log(this.address);
    if (!this.address) return "";
    return quiteAddress(this.address);
  }

  checkToken() {
    let token = localStorage.getItem(`token_${this.address}`);
    if (token) {
      this.token = token;
    }
    return token;
  }

  async requestToken() {
    const timestamp = Math.floor(+Date.now() / 1000);
    const user = this.address;
    const signuature = await requestSignuature({ timestamp, user });
    const token = await login(user, timestamp, signuature);
    this.setToken(token);
    return token;
  }

  async setToken(token) {
    if (token) {
      localStorage.setItem(`token_${this.address}`, token);
    } else {
      localStorage.removeItem(`token_${this.address}`);
    }
    this.token = token;
  }
}

export default new Chain();
