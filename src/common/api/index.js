import ajax from "@common/ajax";
const API = {
  getContractAddress: "/index/getContractAddress",
  getHeroConfigList: "/hero/heroBaseList",
  getHeroList: "/hero/userHeroBaseList",
  checkTransactionHashStatus: "/hashstatus/getHashStatus",
  getRoundList: "/round/roundList", // 获取关卡列表
  combat: "/round/combat", // 挑战关卡
  getFormationList: "/formation/getFormationList",
  getUserInfo: "/users/getUserInfo",
  getUnionList: "/guild/getGuildList",
  upGuildInfo: "/guild/upGuildInfo",
  getGuildInfo: "/guild/getGuildInfo",
  isGuildUser: "/guild/isGuildUser",
  getGuildUserList: "/guild/getGuildUserList",
  getGuildInviteLogList: "/guild/getGuildInviteLogList",
  getGuildLogList: "/guild/getGuildLogList",
  guildInvitation: "/guild/guildInvitation",
  getGuildUpgradeInfo: "/guild/getGuildUpgradeInfo",
  signInGuild: "/guild/signInGuild",
  signOutGuild: "/guild/signOutGuild",
  expelGuild: "/guild/expelGuild",
  upPosition: "/guild/upPosition",
  testDonate: "/guild/testDonate",
  login: "/users/login",
  modifyInfo: "/users/upUserInfo",
  receiveAwardExpAndGold: "/users/receiveAwardExpAndGold", //获取经验书和EOCC
  getCityList: "/city/getCityList",
  getSignUp: "/city/getSignUp",
  guildFighting: "/city/guildFighting",
  abandonedCity: "/city/abandonedCity",
  getFightReward: "/city/getFightReward",
  getMarketHeroList: "/market/getMarketList",
  getMarketMaterialList: "/market/getMarketPropList",
  signAddLand: "/users/addLand",
  getHero: "/hero/userHeroBase",
  getSignUpCountDown: "/city/getSignUpCountDown",
  getFightCountDown: "/city/getFightCountDown",
  getMySignUp: "/city/getMySignUp",
  receiveAwardMmr: "/users/receiveAwardMmr",
};

export async function fetchContractAddress(env = 1) {
  const api = API.getContractAddress;
  return ajax.get(api, { params: { env } }).then((res) => {
    return res.data;
  });
}

export async function fetchUserInfo(address, token) {
  const api = API.getUserInfo;
  return ajax
    .get(api, { params: { user: address, sign: token } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchHeroConfigList() {
  const api = API.getHeroConfigList;
  return ajax.get(api, { params: { page: 1, pagesize: 1000 } }).then((res) => {
    return res.data;
  });
}

export async function fetchUserHeroList(address, token) {
  const api = API.getHeroList;
  return ajax
    .get(api, {
      params: {
        page: 1,
        pagesize: 100000,
        user: address,
        rarity: 0,
        sign: token,
      },
    })
    .then((res) => {
      return res.data;
    });
}

export async function fetchUserHeroDetail(address, token, token_id) {
  const api = API.getHero;
  return ajax
    .get(api, {
      params: {
        user: address,
        token_id,
        sign: token,
      },
    })
    .then((res) => {
      return res.data;
    });
}

export async function checkTransactionHash(hash) {
  const api = API.checkTransactionHashStatus;
  return ajax.get(api, { params: { hash } }).then((res) => res.data);
}
export async function queryRoundList(page = 1, pagesize = 400) {
  const api = API.getRoundList;
  return ajax.get(api, { params: { page, pagesize } }).then((res) => res.data);
}

export async function fetchFormationList(address, token) {
  const api = API.getFormationList;
  return ajax
    .get(api, { params: { user: address, sign: token } })
    .then((res) => res.data);
}

export async function combat(address, roundId, token) {
  const api = API.combat;
  return ajax
    .get(api, { params: { user: address, round_id: roundId, sign: token } })
    .then((res) => res);
}
/**
 *
 *公会相关
 */
// 修改公会信息
export async function upGuildInfo({
  user,
  guild_id,
  name,
  invite_method,
  avatar_image,
  min_bp,
  notice,
  sign,
}) {
  const api = API.upGuildInfo;
  return ajax
    .get(api, {
      params: {
        user,
        guild_id,
        name,
        invite_method,
        avatar_image,
        min_bp,
        notice,
        sign,
      },
    })
    .then((res) => {
      // console.log(res);
      return res;
    });
}
// 获取公会列表
export async function getUnionList({
  user,
  page = 1,
  pagesize = 1000,
  name = "",
  sign,
}) {
  const api = API.getUnionList;
  return ajax
    .get(api, { params: { user, page, pagesize, name, sign } })
    .then((res) => {
      // console.log("公会列表", res);
      return res.data;
    });
}
// 获取公会详情信息
export async function getGuildInfo({ user, guild_id, sign }) {
  const api = API.getGuildInfo;
  return ajax.get(api, { params: { user, guild_id, sign } }).then((res) => {
    // console.log("公会详情", res);
    return res.data;
  });
}
// 是否是公会成员
export async function isGuildUser(user, guild_id) {
  const api = API.isGuildUser;
  return ajax.get(api, { params: { user, guild_id } }).then((res) => {
    // console.log(res);
    return res.data;
  });
}
// 获取公会成员
export async function getGuildUserList({
  user,
  guild_id,
  page = 1,
  pagesize = 3000,
  sign,
}) {
  const api = API.getGuildUserList;
  return ajax
    .get(api, { params: { user, guild_id, page, pagesize, sign } })
    .then((res) => {
      return res.data;
    });
}
// 获取公会邀请记录列表
export async function getGuildInviteLogList({
  user,
  page = 1,
  pagesize = 400,
  sign,
}) {
  const api = API.getGuildInviteLogList;
  return ajax
    .get(api, { params: { user, page, pagesize, sign } })
    .then((res) => {
      return res.data;
    });
}
// 获取公会日志列表
export async function getGuildLogList({
  user,
  guild_id,
  page = 1,
  pagesize = 400,
  sign,
}) {
  const api = API.getGuildLogList;
  return ajax
    .get(api, { params: { user, guild_id, page, pagesize, sign } })
    .then((res) => {
      return res.data;
    });
}
// 发起公会邀请
export async function guildInvitation({ user, buser, sign }) {
  const api = API.guildInvitation;
  return ajax.get(api, { params: { user, buser, sign } }).then((res) => {
    return res;
  });
}
// 加入公会
export async function signInGuild({ user, guild_id, sign }) {
  const api = API.signInGuild;
  return ajax.get(api, { params: { user, guild_id, sign } }).then((res) => {
    return res;
  });
}
// 退出公会
export async function signOutGuild({ user, sign }) {
  const api = API.signOutGuild;
  return ajax.get(api, { params: { user, sign } }).then((res) => {
    return res;
  });
}
// 逐出公会
export async function expelGuild({ user, expel_user, sign }) {
  const api = API.expelGuild;
  return ajax.get(api, { params: { user, expel_user, sign } }).then((res) => {
    return res;
  });
}
// 修改会长
export async function upPosition({ user, to_user, sign }) {
  const api = API.upPosition;
  return ajax.get(api, { params: { user, to_user, sign } }).then((res) => {
    return res;
  });
}
// 获取公会升级等级相关数据
export async function getGuildUpgradeInfo({ sign }) {
  const api = API.getGuildUpgradeInfo;
  return ajax.get(api, { params: { sign } }).then((res) => {
    return res;
  });
}
// 测试捐钱接口
export async function testDonate({ user, num, sign }) {
  const api = API.testDonate;
  return ajax.get(api, { params: { user, num, sign } }).then((res) => {
    return res;
  });
}
export async function login(user, timestamp, signuature) {
  const api = API.login;
  return ajax
    .get(api, { params: { user, timestamp, signuature } })
    .then((res) => res.data);
}
export async function modifyInfoAsync({ user, nickname, head, sign }) {
  const api = API.modifyInfo;
  return ajax
    .get(api, { params: { user, nickname, head, sign } })
    .then((res) => res);
}
// 公会战
export async function getCityList() {
  const api = API.getCityList;
  return ajax.get(api).then((res) => res.data);
}
export async function getSignUp({
  user,
  is_count,
  guild_id = "",
  page = 1,
  pagesize = 1000,
  sign,
}) {
  const api = API.getSignUp;
  return ajax
    .get(api, { params: { user, is_count, page, pagesize, sign, guild_id } })
    .then((res) => res.data);
}
export async function guildFighting({ user, city_id, sign }) {
  const api = API.guildFighting;
  return ajax.get(api, { params: { user, city_id, sign } }).then((res) => res);
}
export async function abandonedCity({ user, city_id, sign }) {
  const api = API.abandonedCity;
  return ajax.get(api, { params: { user, city_id, sign } }).then((res) => {
    return res;
  });
}
export async function getFightReward({ user, city_id, sign }) {
  const api = API.getFightReward;
  return ajax
    .get(api, { params: { user, city_id, sign } })
    .then((res) => res.data);
}
export async function getSignUpCountDown({ user, sign }) {
  const api = API.getSignUpCountDown;
  return ajax.get(api, { params: { user, sign } }).then((res) => res.data);
}
export async function getFightCountDown({ user, city_id, sign }) {
  const api = API.getFightCountDown;
  return ajax
    .get(api, { params: { user, city_id, sign } })
    .then((res) => res.data);
}
export async function getMySignUp({ user, sign }) {
  const api = API.getMySignUp;
  return ajax.get(api, { params: { user, sign } }).then((res) => res.data);
}
export async function receiveAwardMmr({ user, sign }) {
  const api = API.receiveAwardMmr;
  return ajax.get(api, { params: { user, sign } }).then((res) => res.data);
}
// 查询市场英雄
export async function fetchMarketHeroList({
  user,
  page = 1,
  pagesize = 100,
  status,
  rarity,
  power_sort,
  price_sort,
  token,
  my_type,
  sign,
  keyword,
}) {
  const api = API.getMarketHeroList;
  return ajax
    .get(api, {
      params: {
        user,
        page,
        pagesize,
        status,
        rarity,
        power_sort,
        price_sort,
        token,
        my_type,
        sign,
        keyword,
      },
    })
    .then((res) => res.data);
}

// 查询市场道具
export async function fetchMarketMaterialList({
  user,
  page = 1,
  pagesize = 100,
  sign,
  prop_token,
  keyword,
  total_price_sort,
  num_sort,
  status,
  price_sort,
  token,
  my_type,
}) {
  const api = API.getMarketMaterialList;
  return ajax
    .get(api, {
      params: {
        user,
        page,
        pagesize,
        status,
        price_sort,
        token,
        my_type,
        sign,
        prop_token,
        keyword,
        total_price_sort,
        num_sort,
      },
    })
    .then((res) => res.data);
}

// 开启农田
export async function signAddLand(address, openLandNumber, sign) {
  const api = API.signAddLand;
  return ajax
    .get(api, { params: { user: address, land_num: openLandNumber, sign } })
    .then((res) => res.data);
}
// 领取奖励
export async function receiveAwardExpAndGold(user) {
  const api = API.receiveAwardExpAndGold;
  return ajax.get(api, { params: { user } }).then((res) => res);
}
window.fetchUserHeroList = fetchUserHeroList;
window.checkTransactionHash = checkTransactionHash;
window.queryRoundList = queryRoundList;
window.fetchFormationList = fetchFormationList;
