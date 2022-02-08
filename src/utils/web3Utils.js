import loading from "@components/ChainLoading";
import chain from "../store/chain";
import {
  BaseERC20 as BaseERC20Abi,
  EmpireMavern as EmpireMavernAbi,
  Miner as MinerAbi,
  GameDB as GameDBAbi,
  BattleRoundSelf as BattleRoundSelfAbi,
  HeroManager as HeroManagerAbi,
  GuildManager as GuildManagerAbi,
  Market as MarketAbi,
  HeroNFT as HeroNFTAbi,
  MutilCall as MutilCallAbi,
  VerifyBattleReward as VerifyBattleRewardAbi,
  PropMarket as PropMarketAbi,
  verifyGuildFightReward as verifyGuildFightRewardAbi,
} from "../abi";
import { Toast } from "antd-mobile";
import { idx } from "@utils/idxLIst";
import { digitWei, computeSymbolToWei, computeWeiToSymbol } from "./common";
import { HeroRarity } from "@common/const/define/hero";
import { checkTransactionHash } from "@common/api";

let web3_Provider = null;
if (typeof window.web3 !== "undefined") {
  web3_Provider = new window.Web3(window.web3.currentProvider);
  window.utils = web3_Provider.utils;
  window.web3_Provider = web3_Provider;
}

export async function getAccounts() {
  return window.ethereum?.request({ method: "eth_accounts" });
}

let Global_Contract = {};
let Contract = {
  BaseERC20: "BaseERC20",
  EmpireMavern: "EmpireMavern",
  Miner: "Miner",
  GameDB: "GameDB",
  BattleRoundSelf: "BattleRoundSelf",
  HeroManager: "HeroManager",
  GuildManager: "GuildManager",
  Market: "Market",
  HeroNFT: "HeroNFT",
  MutilCall: "MutilCall",
  VerifyBattleReward: "VerifyBattleReward",
  PropMarket: "PropMarket",
  verifyGuildFightReward: "verifyGuildFightReward",
};
let Abi = {
  BaseERC20: BaseERC20Abi,
  EmpireMavern: EmpireMavernAbi,
  Miner: MinerAbi,
  GameDB: GameDBAbi,
  BattleRoundSelf: BattleRoundSelfAbi,
  HeroManager: HeroManagerAbi,
  GuildManager: GuildManagerAbi,
  Market: MarketAbi,
  HeroNFT: HeroNFTAbi,
  MutilCall: MutilCallAbi,
  VerifyBattleReward: VerifyBattleRewardAbi,
  PropMarket: PropMarketAbi,
  verifyGuildFightReward: verifyGuildFightRewardAbi,
};

function getNowUserAddress() {
  return chain.address;
}

export function enable() {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask没有安装!");
      return;
    }
    if (typeof window.web3 === "undefined") {
      console.log("看起来你需要一个Dapp浏览器来启动。");
      return;
    }
    if (window.ethereum.enable) {
      window.ethereum
        .enable()
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
      return;
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
    }
  });
}

function getContract(contractName, contractAddress) {
  if (contractAddress === undefined) {
    console.log(
      "网络错误 ===> contractName, contractAddress",
      contractName,
      contractAddress
    );
    Toast.show({
      icon: "fail",
      content: "网络错误",
    });
    return null;
  }
  if (web3_Provider === null) {
    if (typeof window.web3 !== "undefined") {
      web3_Provider = new window.Web3(window.web3.currentProvider);
      window.utils = web3_Provider.utils;
      window.web3_Provider = web3_Provider;
    }
  }
  if (web3_Provider === null) return null;
  if (
    [
      Contract.BaseERC20,
      Contract.EmpireMavern,
      Contract.Miner,
      Contract.DBAddress,
      Contract.BattleRoundSelf,
      Contract.HeroManager,
      Contract.GuildManager,
      Contract.GameDB,
      Contract.Market,
      Contract.HeroNFT,
      Contract.MutilCall,
      Contract.VerifyBattleReward,
      Contract.PropMarket,
    ].includes(contractName)
  ) {
    if (!Global_Contract[contractName + contractAddress])
      Global_Contract[contractName + contractAddress] =
        new web3_Provider.eth.Contract(Abi[contractName], contractAddress);
    return Global_Contract[contractName + contractAddress];
  }
  return null;
}

function sendAsync(
  params,
  {
    needLog = false,
    showLoading = true,
    diyLoading = null,
    needServerCheck = true,
  } = {}
) {
  //   loading.show();
  return new Promise((resolve, reject) => {
    window.ethereum.sendAsync(
      {
        method: "eth_sendTransaction",
        params: params,
        from: getNowUserAddress(),
      },
      async function (err, result) {
        // return;
        if (diyLoading) {
          diyLoading(true);
        } else {
          showLoading && loading.show();
        }
        if (!!err) {
          reject(err);
          if (diyLoading) {
            diyLoading(false);
          } else {
            showLoading && loading.hidden();
          }
          return;
        }
        if (result.error) {
          reject(result.error.message);
          if (diyLoading) {
            diyLoading(false);
          } else {
            showLoading && loading.hidden();
          }
          return;
        }
        if (result.result) {
          const receiptResult = await getTransactionReceiptStatus(
            result.result
          );

          if (receiptResult) {
            // 获取到 回执之后 判断 服务器是否验证完成

            let checkResult = true;
            if (needServerCheck) {
              checkResult = await checkServerTransactionHashStatus(
                result.result
              );
            }

            if (checkResult) {
              if (diyLoading) {
                diyLoading(false);
              } else {
                showLoading && loading.hidden();
              }
              if (!needLog) {
                resolve(receiptResult.status); // res.status true or false;
              } else {
                resolve({
                  status: receiptResult.status,
                  logs: receiptResult.logs,
                }); // res.status true or false;
              }
            }
          } else {
          }
        }
      }
    );
  });
}

// 获取链上hash完成状态
function getTransactionReceiptStatus(hash) {
  return new Promise((resolve, reject) => {
    const a = setInterval(() => {
      web3_Provider.eth.getTransactionReceipt(hash).then((res) => {
        // console.log("getTransactionReceipt ==>", res);
        if (res) {
          clearInterval(a);
          resolve(res);
        }
      });
    }, 1000);
  });
}

// 获取服务器上 hash读取状态
async function checkServerTransactionHashStatus(hash) {
  return new Promise((resolve, reject) => {
    const a = setInterval(() => {
      checkTransactionHash(hash).then((res) => {
        // console.log("checkServerTransactionHash ==>", res);
        // clearInterval(a);
        // resolve(true);
        if (res?.processed === 1) {
          clearInterval(a);
          resolve(true);
        }
      });
    }, 1000);
  });
}

/**
 * 代币交易授权
 * @returns
 */
export function approve(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, { needLog: true });
}

/**
 * 是否允许调用钱包地址
 * @returns
 */
export function allowance(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        // console.log("allowance result ====> ", result);
        if (result < 10000000000000000000000000000000) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
  });
}

export async function queryAllowance({ symbol, type = "door" }) {
  const TokenAddress = chain.currencyMap?.[symbol];
  const map = {
    door: chain.contractAddress?.door,
    market: chain.contractAddress?.market,
    materialMarket: chain.contractAddress?.PropMarket,
  };
  const contractAddress = map[type];
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  const result = await new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        resolve(result);
      });
  });
  return result / Math.pow(10, 18);
}
window.isApproveFlow = isApproveFlow;
/**
 * 授权合约允许代币交易流程
 * @param {*} type 1代表MediaAddress,2代表MarketAddress
 * @param {*} TokenAddress 默认为U地址,后续增加更多地址
 * @returns
 */
export async function isApproveFlow({ symbol, type = "door" }) {
  const map = {
    door: chain.contractAddress?.door,
    market: chain.contractAddress?.market,
    materialMarket: chain.contractAddress?.PropMarket,
  };
  const contractAddress = map[type];
  try {
    let isAllowance = await allowance(
      chain.currencyMap?.[symbol],
      contractAddress
    );
    if (isAllowance) {
      return {
        status: true,
        approvement: isAllowance / Math.pow(10, 18),
      };
    }

    let { status, logs } = await approve(
      chain.currencyMap?.[symbol],
      contractAddress
    );
    if (status) {
      return {
        status: status,
        approvement: logs[0].data / Math.pow(10, 18),
      };
    }
  } catch (e) {
    return {
      status: false,
      approvement: 0,
    };
  }
}

/**
 * 根据代币地址获取
 * @param {*} TokenAddress
 */
export async function queryBalance(symbol) {
  const TokenAddress = chain.currencyMap?.[symbol];
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      } else {
        resolve(result);
      }
    });
  });
}

//获取当前区块号
export async function getCurrentBlock() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  return blockNumber;
}
//获取当前区块时间
export async function getBlockgTime() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  const blockTime = await web3_Provider.eth.getBlock(blockNumber);
  return blockTime.timestamp;
}

// 酒馆相关 EmpireMavern

// LottyA ==> cost 20个u
// LottyB ==>  cost 30个u 5000EOCC
// LottyC ==> cost 1000 mmr

// primary 初级
// intermediate 中级
// senior 高级
export async function EmpireMavernLottery(type = "primary", diyLoading) {
  const Address = chain.contractAddress?.EmpireMavern;
  const contract = getContract(Contract.EmpireMavern, Address);

  // console.log("addresss", Address);

  const map = {
    primary: "LottyA",
    intermediate: "LottyB",
    senior: "LottyC",
  };
  let func = contract?.methods[map[type]];
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: func?.().encodeABI(),
    },
  ];
  const { status, logs } = await sendAsync(params, {
    needLog: true,
    showLoading: false,
    diyLoading,
    needServerCheck: true,
  });
  if (status === true) {
    const currentLog = logs.pop();
    const isNFT = chain.contractAddress?.HeroNFT === currentLog.address;
    if (isNFT) {
      // 是NFT
      const [, tokenId, baseId] = currentLog.topics;
      return {
        type: "NFT",
        tokenId: parseInt(tokenId),
        baseId: parseInt(baseId) + 1,
      };
    }
    return {
      type: "MATERIAL",
      materialKey: chain.materialMap?.[currentLog.address],
    };
  }
  return null;
}

export async function batchLotty(code = 1) {
  const Address = chain.contractAddress?.EmpireMavern;
  const contract = getContract(Contract.EmpireMavern, Address);

  let func = contract?.methods.batchLotty;
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: func?.(code).encodeABI(),
    },
  ];
  return sendAsync(params);
}

window.batchLotty = batchLotty;
// window.EmpireMavernLottery = EmpireMavernLottery;
// window.resetCard = resetCard;
// window.isApproveFlow = isApproveFlow;
// window.queryAllowance = queryAllowance;
// window.queryBalance = queryBalance;

/**
 * @生产
 * --------------------------------------------------------->
 */
/**
 * @生产_现有农田
 * CURRENT_POWER
 */
export async function production_nowhave() {
  // console.log("现有农田", Contract.GameDB, chain.contractAddress?.DBAddress);
  // console.log("Abi==>", Contract.GameDB);
  // console.log("Contract.GameDB-->", Contract);
  // console.log("chain.contractAddress?.GameDB", chain.contractAddress);
  const contract = getContract(
    Contract.GameDB,
    chain.contractAddress?.DBAddress
  );
  // console.log("contract", contract);
  return new Promise((resolve) => {
    contract?.methods
      ?.getUserData(getNowUserAddress(), idx.CURRENT_POWER)
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          // console.log("现有农田", computeWeiToSymbol(result, 0));
          resolve(computeWeiToSymbol(result, 0));
        }
      });
  });
}
/**
 * @生产_派遣总产量
 * HERO_REWARD_POWER
 */
export async function production_totalOutput() {
  const contract = getContract(
    Contract.GameDB,
    chain.contractAddress?.DBAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getUserData(getNowUserAddress(), idx.HERO_REWARD_POWER)
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          // console.log("result--->", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * @生产_待领取收益
 *
 */
export async function production_unclaimed() {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  return new Promise((resolve) => {
    contract?.methods
      ?.getPendingCoin(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          // console.log("待领取EOCC--->", result, computeWeiToSymbol(result, 4));
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * @生产_领取奖励
 *
 */
export async function production_withDraw() {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods?.WithDrawCredit().encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * @生产_派遣单个英雄
 *
 */
export async function production_sendHero(tokenID) {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  const wei = web3_Provider.utils.toBN(tokenID);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods
        ?.AddHeroToFarm(
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * @生产_派遣多个英雄
 *
 */
export async function production_sendHeros(tokenIDS = []) {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  const gettokenIDS = tokenIDS.map((item) => {
    return web3_Provider.utils.toHex(
      web3_Provider.utils.toBN(web3_Provider.utils.toBN(item))
    );
  });
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods?.AddBatchHeroToFarm(tokenIDS).encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * @生产_取消派遣
 *
 */
export async function production_removeHeros(tokenIDS = []) {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  // const wei = web3_Provider.utils.toBN(tokenID);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods?.RemoveBatchHeroFromFarm(tokenIDS).encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * @生产_开垦第一次农田
 *
 */
export async function production_openFarm() {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods?.OpenFarmSystem().encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * @生产_添加农田
 *
 */
export async function production_addFarm(openLandHex, roundHex, idx, sign) {
  const contract = getContract(Contract.Miner, chain.contractAddress?.miner);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.miner,
      value: "0x0",
      data: contract?.methods
        ?.AddFarmLand(
          getNowUserAddress(),
          "0x" + openLandHex,
          "0x" + roundHex,
          idx,
          sign
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// window.production_nowhave = production_nowhave;
// window.production_totalOutput = production_totalOutput;
// window.production_unclaimed = production_unclaimed;
// window.production_withDraw = production_withDraw;
// window.production_sendHero = production_sendHero;
// window.production_sendHeros = production_sendHeros;
// window.production_openFarm = production_openFarm;
// window.production_addFarm = production_addFarm;
// window.production_removeHeros = production_removeHeros;
// 现有农田 GameDB --->getUserData(CURRENT_POWER)
// 派遣总产量 GameDB --->getUserData(HERO_REWARD_POWER)
// 待领取 Miner --->getPendingCoin()
// 领取奖励 Miner --->WithDrawCredit()
// 派遣单个英雄 Miner --->AddHeroToFarm()
// 派遣多个英雄 Miner --->AddBatchHeroToFarm([英雄ID的数组])
// 开垦第一次 Miner --->OpenFarmSystem(消耗一把锄头，先判断锄头的余额，锄头不需要授权)
// 开垦十次 Miner --->AddFarmLand(消耗mmr余额，先判断mmr余额，需要授权)
// 查询是否开垦 GameDB --->getUserData(CURRENT_POWER)

/**
 * @关卡
 * --------------------------------------------------------->
 */
/**
 * @关卡_首通的人
 * GameDB   getFirstWinner
 */
export async function battle_getFirstWinner(roundid) {
  const contract = getContract(
    Contract.GameDB,
    chain.contractAddress?.DBAddress
  );
  const wei = web3_Provider.utils.toBN(roundid);
  return new Promise((resolve) => {
    contract?.methods
      ?.getFirstWinner(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          // console.log("result--->", result);
          resolve(result);
        }
      });
  });
}
/**
 * @关卡_首通需要的最低战力
 * BattleRoundSelf  getRoundNeedPower
 */
export async function battle_needPower(roundid) {
  const contract = getContract(
    Contract.BattleRoundSelf,
    chain.contractAddress?.BattleRoundSelf
  );
  const wei = web3_Provider.utils.toBN(roundid);
  return new Promise((resolve) => {
    contract?.methods
      ?.getRoundNeedPower(
        web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
      )
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}
/**
 * 经验书_关卡*5，EOCC_关卡*5 Attack
 */

/**
 * @关卡_当前用户的的关数
 * GameDB getUserData   idx=NowRound
 */
export async function battle_nowRound() {
  const contract = getContract(
    Contract.GameDB,
    chain.contractAddress?.DBAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getUserData(getNowUserAddress(), idx.NowRound)
      .call((err, result) => {
        if (err) {
          // console.log("err", err);
          resolve(false);
        }
        if (result) {
          // console.log("result--->", result);
          // resolve(computeWeiToSymbol(result, 4));
          resolve(result);
        }
      });
  });
}
/**
 * @战斗攻击
 *BattleRoundSelf   Attack (关数)
 */
export async function battle_attack(roundid) {
  const contract = getContract(
    Contract.BattleRoundSelf,
    chain.contractAddress?.BattleRoundSelf
  );
  const wei = web3_Provider.utils.toBN(roundid);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.BattleRoundSelf,
      value: "0x0",
      data: contract?.methods
        ?.Attack(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
// window.battle_getFirstWinner = battle_getFirstWinner;
// window.battle_needPower = battle_needPower;
// window.battle_attack = battle_attack;
// window.battle_nowRound = battle_nowRound;
/// =======>

export async function UseExpBook(heroId, type, number) {
  // console.log("heroId, type, number== ==>", heroId, type, number);
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);

  const map = {
    ExperienceBookPrimary: "UseExpBookA",
    ExperienceBookIntermediate: "UseExpBookB",
    ExperienceBookSenior: "UseExpBookC",
  };
  let func = contract?.methods[map[type]];
  const wei = computeSymbolToWei(number);
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: func?.(heroId, wei).encodeABI(),
    },
  ];

  return sendAsync(params);
}

export async function UseSpiritDrug() {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods?.UseSpiritDrug().encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function HeroSynthesis(heroId, materialHeroIdArray, type) {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);
  // console.log(
  //   "chain.contractAddress?.HeroManager",
  //   chain.contractAddress?.HeroManager
  // );
  const map = {
    [HeroRarity.N]: "ComposeHero1",
    [HeroRarity.R]: "ComposeHero2",
    [HeroRarity.SR]: "ComposeHero3",
  };
  let func = contract?.methods[map[type]];
  // console.log(
  //   "heroId, materialHeroIdArray",
  //   heroId,
  //   materialHeroIdArray,
  //   map[type],
  //   type
  // );
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: func?.(heroId, materialHeroIdArray).encodeABI(),
    },
  ];

  const { status, logs } = await sendAsync(params, {
    needLog: true,
    showLoading: true,
    diyLoading: null,
    needServerCheck: true,
  });
  if (status === true) {
    const currentLog = logs.pop();
    const [, , tokenId, baseId] = currentLog.topics;
    return {
      tokenId: parseInt(tokenId),
      baseId: parseInt(baseId) + 1,
    };
  }
  return null;
}

export async function UpgradeHero(heroId, materialHeroId) {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);
  // console.log(
  // "chain.contractAddress?.HeroManager",
  //   chain.contractAddress?.HeroManager
  // );

  // console.log(heroId, materialHeroId, Address);
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods?.UpgradeHero(heroId, materialHeroId).encodeABI(),
    },
  ];

  return sendAsync(params);
}

export async function resetCard(heroId) {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);

  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods?.resetCard(heroId).encodeABI(),
    },
  ];

  return sendAsync(params);
}

// 单个 上阵英雄
export async function UpdateHeroSlot(slotId, tokenId) {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);

  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods?.UpdateHeroSlot(slotId, tokenId).encodeABI(),
    },
  ];

  return sendAsync(params);
}

export async function UpdateHeroSlotBatch(
  diffSlotArray,
  oldTokenIdArray,
  newTokenIdArray
) {
  const Address = chain.contractAddress?.HeroManager;
  const contract = getContract(Contract.HeroManager, Address);
  // console.log(
  //   "UpdateHeroSlotBatch",
  //   diffSlotArray,
  //   oldTokenIdArray,
  //   newTokenIdArray
  // );
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods
        ?.UpdateHeroSlotBatch(diffSlotArray, oldTokenIdArray, newTokenIdArray)
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}

// 用户签名
export async function requestSignuature(signData) {
  let signString = signData;
  if (typeof signData === "object") {
    const sortedKey = Object.keys(signData).sort();
    signString = sortedKey.map((key) => signData[key]).join("_");
  }
  if (web3_Provider === null) {
    if (typeof window.web3 !== "undefined") {
      web3_Provider = new window.Web3(window.web3.currentProvider);
      window.utils = web3_Provider.utils;
      window.web3_Provider = web3_Provider;
    }
  }
  return web3_Provider.eth.personal.sign(signString, getNowUserAddress());
}

/**
 * 公会接口
 */
//公会_创建公会
export async function CreateGuild() {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.CreateGuild().encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_退出公会
export async function ExitGuild() {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.ExitGuild().encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_捐献
export async function dotnetGuild(guildid, amount) {
  // console.log("捐献", guildid, amount);
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods
        ?.dotnetGuild(
          guildid,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_移除成员
export async function RemoveMember(guildid, user) {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.RemoveMember(guildid, user).encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_转让会长
export async function setGuildMaster(guildid, newmaster) {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.setGuildMaster(guildid, newmaster).encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_邀请
export async function AddMember(guildid, user) {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.AddMember(guildid, user).encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_加入
export async function JoinGuild(guildid) {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.JoinGuild(guildid).encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会_升级
export async function UpgradeLevel(guildid) {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.UpgradeLevel(guildid).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// window.CreateGuild = CreateGuild;
// window.ExitGuild = ExitGuild;
// window.dotnetGuild = dotnetGuild;
// window.RemoveMember = RemoveMember;
// window.setGuildMaster = setGuildMaster;
// window.AddMember = AddMember;
// window.JoinGuild = JoinGuild;

// market

// 上架
export async function Market_Hero_UpShelf(tokenId, price, symbol) {
  const contract = getContract(Contract.Market, chain.contractAddress?.market);
  const TokenAddress = chain.currencyMap?.[symbol];
  const wei = computeSymbolToWei(price);
  const HexWei = web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei));
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.market,
      value: "0x0",
      data: contract?.methods
        ?.upShelf(tokenId, {
          price: HexWei,
          token: TokenAddress,
        })
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 下架
export async function Market_Hero_DownShelf(tokenId) {
  const contract = getContract(Contract.Market, chain.contractAddress?.market);
  // console.log("tokenId", tokenId);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.market,
      value: "0x0",
      data: contract?.methods?.downShelf(tokenId).encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 市场购买
export async function Market_Hero_Buy(tokenId) {
  const contract = getContract(Contract.Market, chain.contractAddress?.market);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.market,
      value: "0x0",
      data: contract?.methods?.buy(tokenId).encodeABI(),
    },
  ];
  return sendAsync(params);
}

// NFT授权给市场
export async function Market_Hero_Approve(tokenId) {
  const contract = getContract(
    Contract.HeroNFT,
    chain.contractAddress?.HeroNFT
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.HeroNFT,
      value: "0x0",
      data: contract?.methods
        ?.approve(chain.contractAddress?.market, tokenId)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 获取所有的链上资产
export async function queryAllBalanceOf() {
  const contract = getContract(
    Contract.MutilCall,
    chain.contractAddress?.mutilcall
  );

  return new Promise((resolve) => {
    contract?.methods?.AllBalanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      } else {
        resolve(result);
      }
    });
  });
}

// window.queryAllBalanceOf = queryAllBalanceOf;

//
/**
 * goldAmount, ===> EOCC
 * expBookAmount ===> 初级经验书
 * id,
 * sign
 */
export async function Battle_Reward(expHex, goldHex, hoeHex, idx, sign) {
  const contract = getContract(
    Contract.VerifyBattleReward,
    chain.contractAddress?.verifyHoeReward
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.verifyHoeReward,
      value: "0x0",
      data: contract?.methods
        ?.reward(
          getNowUserAddress(),
          "0x" + expHex,
          "0x" + goldHex,
          "0x" + hoeHex,
          idx,
          sign
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 是否授权给Market
export async function Market_isApprovedForAll() {
  const contract = getContract(
    Contract.HeroNFT,
    chain.contractAddress?.HeroNFT
  );

  const MarketAddress = chain.contractAddress?.market;
  return new Promise((resolve) => {
    contract?.methods
      ?.isApprovedForAll(getNowUserAddress(), MarketAddress)
      .call((err, result) => {
        if (err) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
  });
}

export async function Market_QueryFee() {
  const contract = getContract(Contract.Market, chain.contractAddress?.market);

  return new Promise((resolve) => {
    contract?.methods?._fee().call((err, result) => {
      if (err) {
        resolve(false);
      } else {
        resolve(result);
      }
    });
  });
}

// 授权给Market

export async function Market_ApprovedForAll() {
  const contract = getContract(
    Contract.HeroNFT,
    chain.contractAddress?.HeroNFT
  );
  const MarketAddress = chain.contractAddress?.market;

  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.HeroNFT,
      value: "0x0",
      data: contract?.methods
        ?.setApprovalForAll(MarketAddress, true)
        .encodeABI(),
    },
  ];
  return sendAsync(params, {
    needLog: false,
    showLoading: true,
    diyLoading: null,
    needServerCheck: false,
  });
}

// window.sendToOther = sendToOther;
export async function sendToOther(receiveAddress, number, type) {
  const contract = getContract(Contract.BaseERC20, chain.currencyMap?.[type]);
  const wei = computeSymbolToWei(number);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.currencyMap?.[type],
      value: "0x0",
      data: contract?.methods
        ?.transfer(
          receiveAddress,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, {
    needLog: false,
    showLoading: true,
    diyLoading: null,
    needServerCheck: false,
  });
}

export async function Hero_Transfer(address, tokenId) {
  // return false;
  const contract = getContract(
    Contract.HeroNFT,
    chain.contractAddress?.HeroNFT
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.HeroNFT,
      value: "0x0",
      data: contract?.methods?.transfer(address, tokenId).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 上架
export async function Market_Material_UpShelf(
  materialKey,
  materialAmount,
  price,
  symbol
) {
  // console.log(`Market_Material_UpShelf =====> `, arguments);
  const contract = getContract(
    Contract.PropMarket,
    chain.contractAddress?.PropMarket
  );
  const TokenAddress = chain.currencyMap?.[symbol];
  const MaterialAddress = chain.currencyMap?.[materialKey];
  const MaterialWei = computeSymbolToWei(materialAmount);
  const HexMaterialWei = web3_Provider.utils.toHex(
    web3_Provider.utils.toBN(MaterialWei)
  );
  const wei = computeSymbolToWei(price);
  const HexWei = web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei));
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.PropMarket,
      value: "0x0",
      data: contract?.methods
        ?.upShelf({
          propAmt: HexMaterialWei,
          propAddr: MaterialAddress,
          batchPrice: HexWei,
          token: TokenAddress,
        })
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 下架
export async function Market_Material_DownShelf(orderId) {
  const contract = getContract(
    Contract.PropMarket,
    chain.contractAddress?.PropMarket
  );
  // console.log(`Market_Material_DownShelf =====> `, arguments);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.PropMarket,
      value: "0x0",
      data: contract?.methods?.downShelf(orderId).encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 市场购买
export async function Market_Material_Buy(orderId) {
  // console.log(`Market_Material_DownShelf =====> `, arguments);

  const contract = getContract(
    Contract.PropMarket,
    chain.contractAddress?.PropMarket
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.PropMarket,
      value: "0x0",
      data: contract?.methods?.buy(orderId).encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function Market_Material_QueryFee() {
  const contract = getContract(
    Contract.PropMarket,
    chain.contractAddress?.PropMarket
  );
  return new Promise((resolve) => {
    contract?.methods?._fee().call((err, result) => {
      if (err) {
        resolve(false);
      } else {
        resolve(result);
      }
    });
  });
}

// window.Market_Material_UpShelf = Market_Material_UpShelf;
// window.Market_Material_DownShelf = Market_Material_DownShelf;
// window.Market_Material_Buy = Market_Material_Buy;

//公会战__报名
export async function UnionBattle_signup() {
  const contract = getContract(
    Contract.GuildManager,
    chain.contractAddress?.guidmanager
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.guidmanager,
      value: "0x0",
      data: contract?.methods?.IntoTodayWar().encodeABI(),
    },
  ];
  return sendAsync(params);
}
//公会战__报名
export async function UnionBattle_getMMR({
  userAddress,
  usdtHex,
  mmrsHex,
  idx,
  sign,
}) {
  const contract = getContract(
    Contract.verifyGuildFightReward,
    chain.contractAddress?.verifyGuildFightReward
  );
  console.log("参数", userAddress, usdtHex, mmrsHex, idx, sign);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.verifyGuildFightReward,
      value: "0x0",
      data: contract?.methods?.reward(
        userAddress,
        "0x" + usdtHex,
        "0x" + mmrsHex,
        idx,
        sign
      ),
    },
  ];
  return sendAsync(params);
}
