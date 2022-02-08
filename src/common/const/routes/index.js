import Home from "@pages/Home";
import Union from "@pages/Union";
import Battle from "@pages/Battle";
import BattleExplain from "@pages/Battle/Explain";
import Tavern from "@pages/Tavern";
import Market from "@pages/Market";
import PropsDetail from "@pages/Market/PropsDetail";
import SaleDetail from "@pages/Market/SaleDetail";
import Sale from "@pages/Market/Sale";

import MySale from "@pages/Market/MySale";
import MySaleDetail from "@pages/Market/MySaleDetail";
import MyPropsDetail from "@pages/Market/MyPropsDetail";

// import MyEmployee from "@pages/HeroHire/MyEmployee";
// import MyEmployeeDetail from "@pages/HeroHire/MyEmployee/MyEmployeeDetail";

import HireMarket from "@pages/HeroHire";
import MyHire from "@pages/HeroHire/MyHire";
import MyHireDetail from "@pages/HeroHire/MyHire/MyHireDetail";
import Hire from "@pages/HeroHire/Hire";
import HireDetail from "@pages/HeroHire/HireDetail";
import MyEmployee from "@pages/HeroHire/MyEmployee";
import MyEmployeeDetail from "@pages/HeroHire/MyEmployee/MyEmployeeDetail";
import Inventory from "@pages/Inventory";
import ResourceLoading from "@pages/ResourceLoading";
import Production from "@pages/Production";
import Dispatch from "@pages/Production/Dispatch";
import UnionBattle from "@pages/UnionBattle";
import Hero from "@pages/Hero";
import BattleFormation from "@pages/Hero/BattleFormation";
import UnionManage from "@pages/Union/UnionManage";
import HeroSynthesis from "@pages/Hero/Synthesis";
import HeroDetail from "@pages/Hero/HeroDetail";
import HeroLevelUp from "@pages/Hero/LevelUp";
import HeroStarUp from "@pages/Hero/StarUp";
import Invitation from "@pages/Invitation";
import UnionDonate from "@pages/Union/UnionDonate";
import CardMember from "@pages/CardMember";
import Login from "@pages/Login";
import UnionMain from "@pages/Union/UnionMain";
import UnionList from "@pages/Union/UnionList";
import UnionBattleExplain from "@pages/UnionBattle/Explain";
import CityDetails from "@pages/UnionBattle/CityDetails";

const routes = {
  home: {
    components: Home,
    title: "首页",
    // titleKey: "home",
  },
  battle: {
    components: Battle,
    title: "战役",
    titleKey: "War",
  },
  battleExplain: {
    components: BattleExplain,
    title: "战役",
    titleKey: "War",
  },
  union: {
    components: Union,
    title: "公会",
    titleKey: "Guild",
  },
  unionmain: {
    components: UnionMain,
    title: "公会 ",
    titleKey: "Guild",
  },
  unionlist: {
    components: UnionList,
    title: "公会 ",
    titleKey: "Guild",
  },
  unionmanage: {
    components: UnionManage,
    title: "管理公会",
  },
  uniondonate: {
    components: UnionDonate,
    title: "捐献",
  },
  market: {
    components: Market,
    title: "市场",
    titleKey: "Market",
  },
  saleDetail: {
    components: SaleDetail,
    title: "出售详情",
  },
  propsDetail: {
    components: PropsDetail,
    title: "出售详情",
  },
  sale: {
    components: Sale,
    title: "出售",
    titleKey: "Sale",
  },

  mySale: {
    components: MySale,
    title: "我的出售",
    titleKey: "My_Sale",
  },
  mySaleDetail: {
    components: MySaleDetail,
    title: "我的出售详情",
  },

  myPropsDetail: {
    components: MyPropsDetail,
    title: "我的出售详情",
  },
  //TODO：市场页面

  hireHero: {
    components: HireMarket,
    title: "雇佣市场",
  },

  myHire: {
    components: MyHire,
    title: "我的出租",
  },
  myHireDetail: {
    components: MyHireDetail,
    title: "出租详情",
  },
  myEmployee: {
    components: MyEmployee,
    title: "我的雇佣",
  },
  employeerDetail: {
    components: MyEmployeeDetail,
    title: "雇佣契约",
  },
  hire: {
    components: Hire,
    title: "出租",
  },
  hireDetail: {
    components: HireDetail,
    title: "雇佣详情",
    titleKey: "Hire",
  },
  production: {
    components: Production,
    title: "生产",
    titleKey: "Produce",
  },
  dispatch: {
    components: Dispatch,
    title: "派遣",
    titleKey: "Dispatch",
  },
  unionBattle: {
    components: UnionBattle,
    title: "公会战",
    icon: true,
    toRoute: "unionBattleExplain",
    titleKey: "Guild_Wars",
  },
  hero: {
    components: Hero,
    title: "英雄",
    titleKey: "Hero",
  },
  heroDetail: {
    components: HeroDetail,
    title: "英雄详情",
    titleKey: "hero_details",
  },
  battleFormation: {
    components: BattleFormation,
    title: "上阵",
    titleKey: "hero_arrangement",
  },
  tavern: {
    components: Tavern,
    title: "酒馆",
    titleKey: "Tavern",
  },
  heroSynthesis: {
    components: HeroSynthesis,
    title: "合成",
    titleKey: "hero_synthesis",
  },
  heroLevelUp: {
    components: HeroLevelUp,
    title: "升级",
    titleKey: "hero_Hero_upgrade",
  },
  heroStarUp: {
    components: HeroStarUp,
    title: "升星",
    titleKey: "hero_Hero_rising_star",
  },
  invitation: {
    components: Invitation,
    title: "邀请好友",
    titleKey: "Invite",
  },
  cardMember: {
    components: CardMember,
    title: "月卡",
    titleKey: "Member",
  },
  login: {
    components: Login,
    // title: "登录",
    // titleKey: 'Login'
  },
  unionBattleExplain: {
    components: UnionBattleExplain,
    title: "公会战",
    titleKey: "Guild_Wars",
  },
  resourceLoading: {
    components: ResourceLoading,
    title: "Loading",
  },
  warehouse: {
    components: Inventory,
    title: "仓库",
    titleKey: "Depot",
  },

  cityDetails: {
    components: CityDetails,
    title: "公会战",
    titleKey: "Guild_Wars",
  },
};

export default routes;
