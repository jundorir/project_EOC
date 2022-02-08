import { makeAutoObservable, reaction, runInAction } from "mobx";
import chain from "../chain";
import {
  upGuildInfo,
  getUnionList,
  getGuildInfo,
  isGuildUser,
  getGuildUserList,
  getGuildInviteLogList,
  getGuildLogList,
  guildInvitation,
  getGuildUpgradeInfo,
  signInGuild,
  signOutGuild,
  expelGuild,
  upPosition,
  testDonate,
} from "@common/api";
import {
  dotnetGuild,
  CreateGuild,
  ExitGuild,
  RemoveMember,
  setGuildMaster,
  AddMember,
  JoinGuild,
  UpgradeLevel,
} from "@utils/web3Utils";
class Union {
  unionList = {
    total: 0,
    data: [],
  }; //公会列表
  unionInfo = {
    id: "", //数据id
    name: "", //	公会名称
    level: "0", //公会等级
    invite_method: 1, //入会制度:1=公开加入,2=邀请制
    num: " 0", //	当前人数
    num_high: "0", //人数上限
    city_id: "", //领地
    city_name: "", //领地名称
    avatar_image: "", //公会头像
    guild_id: "", //公会ID
    min_bp: "", //	最小申请条件
    notice: "", //公告
    exp: "", //公会经验值
    bonus: "0", //生产加成
    contribution: "", //	贡献值
    is_user: "", //是否是成员 0不是 1是
    guild_user: [], //是成员才有成员信息
  }; //公会详细信息
  isGuildUser = false; // 是否是公会成员
  unionUserList = { total: 0, data: [] }; //公会成员列表
  unionInviteLogList = { total: 0, data: [] }; //公会邀请记录列表
  unionLogList = { total: 0, data: [] }; //公会日志记录列表
  guildUpgradeInfo = []; //获取公会升级等级相关数据
  user = null;
  constructor(user) {
    makeAutoObservable(this, { user: false });
    this.user = user;
  }

  async init({ guild_id }) {
    // 获取公会列表
    await this.queryUnionList();
    // 获取公会详细信息
    await this.queryGetGuildInfo({ guild_id });
    // 获取所在公会成员列表
    await this.queryGetGuildUserList({ guild_id });
  }
  async queryFresh({ guild_id }) {
    // 获取公会详细信息
    await this.queryGetGuildInfo({ guild_id });
    // 获取所在公会成员列表
    await this.queryGetGuildUserList({ guild_id });
  }
  // 修改公会信息
  async queryUpGuildInfo(data) {
    const result = await upGuildInfo(data);
    return result;
  }
  reFresh() {
    this.unionList = {
      total: 0,
      data: [],
    };
  }
  // 获取公会列表
  async queryUnionList(name = "") {
    // console.log("name", name);
    const result = await getUnionList({
      user: chain.address,
      sign: chain.token,
      name: name,
    });
    if (result) {
      runInAction(() => {
        this.unionList = result;
      });
    }
  }
  // 获取公会详细信息
  async queryGetGuildInfo({
    guild_id,
    user = chain.address,
    sign = chain.token,
  }) {
    const result = await getGuildInfo({ user, guild_id, sign });
    if (result) {
      runInAction(() => {
        this.unionInfo = result;
      });
    }
  }
  // 判断是否是公会成员
  async queryIsGuildUser(data) {
    const result = await isGuildUser(data);
    runInAction(() => {
      this.isGuildUser = result;
    });
  }
  // 获取所在公会成员列表
  async queryGetGuildUserList({
    guild_id,
    user = chain.address,
    sign = chain.token,
  }) {
    const result = await getGuildUserList({ user, guild_id, sign });
    // console.log("公会成员列表", result);
    if (result) {
      runInAction(() => {
        this.unionUserList = result;
      });
    }
  }
  // 查询工会详情的成员列表
  async queryUnionMembers({
    guild_id,
    user = chain.address,
    sign = chain.token,
  }) {
    const result = await getGuildUserList({ user, guild_id, sign });
    return result;
  }
  // 获取公会邀请记录列表
  async queryGetGuildInviteLogList(data) {
    const result = await getGuildInviteLogList(data);
    if (result) {
      runInAction(() => {
        this.unionInviteLogList = result;
      });
    }
  }
  // 获取公会日志记录列表
  async queryGetGuildLogList(data) {
    const result = await getGuildLogList(data);
    if (result) {
      runInAction(() => {
        this.unionLogList = { total: result.total, data: result.data };
      });
    }
  }
  // //加入公会
  // async signInGuild({ guild_id, user = chain.address, sign = chain.token }) {
  //   const result = await signInGuild({ guild_id, user, sign });
  //   return result;
  // }
  // //退出公会
  // async signOutGuild(data) {
  //   const result = await signOutGuild(data);
  //   console.log("退出公会结果", result);
  //   return result;
  // }
  // //踢出公会
  // async expelGuild(data) {
  //   const result = await expelGuild(data);
  //   console.log("踢出公会结果", result);
  //   return result;
  // }
  //修改会长
  // async upPosition(data) {
  //   const result = await upPosition(data);
  //   console.log("修改会长结果", result);
  //   return result;
  // }
  // 获取公会升级等级相关数据
  async getGuildUpgradeInfo(data) {
    const result = await getGuildUpgradeInfo(data);
    // console.log("获取公会升级等级相关数据", result);
    if (result) {
      runInAction(() => {
        this.guildUpgradeInfo = result;
      });
    }
  }
  // // 发起公会邀请
  // async queryGuildInvitation(data) {
  //   const result = await guildInvitation(data);
  //   console.log(result);
  //   return result;
  // }
  //公会捐献
  async queryDotnetGuild(guildid, amount) {
    const result = await dotnetGuild(guildid, amount);
    return result;
    // try {
    //   const result = await dotnetGuild(guildid, amount);
    //   return result;
    // } catch (error) {
    //   console.log(error);
    // }
    // const result = await testDonate({
    //   num: 1000000,
    //   user: chain.address,
    //   sign: chain.token,
    // });
    // if (result) {
    //   console.log(result);
    //   return result;
    // }
  }
  // 创建公会
  async CreateGuild() {
    const result = await CreateGuild();
    // console.log("创建公会结果--->", result);
    return result;
  }
  //退出工会
  async ExitGuild() {
    const result = await ExitGuild();
    // console.log("退出公会结果--->", result);
    return result;
  }
  //踢出成员
  async RemoveMember(guildid, user) {
    const result = await RemoveMember(guildid, user);
    // console.log("踢出结果--->", result);
    return result;
  }
  //转让会长
  async setGuildMaster(guild_id, newmaster) {
    const result = await setGuildMaster(guild_id, newmaster);
    // console.log("转让会长结果--->", result);
    return result;
  }
  //邀请加入
  async AddMember(guildid, user) {
    const result = await AddMember(guildid, user);
    // console.log("邀请加入结果--->", result);
    return result;
  }
  //加入工会
  async JoinGuild(guild_id) {
    const result = await JoinGuild(guild_id);
    // console.log("加入工会结果--->", result);
    return result;
  }
  //升级工会
  async UpgradeLevel(guild_id) {
    const result = await UpgradeLevel(guild_id);
    // console.log("升级工会结果--->", result);
    return result;
  }
}
export default Union;
