 
let HeroStatus = {};
HeroStatus[(HeroStatus["REST"] = 0)] = "REST";
HeroStatus[(HeroStatus["BATTLE"] = 1)] = "BATTLE";
HeroStatus[(HeroStatus["RECLAMATION"] = 4)] = "RECLAMATION";
HeroStatus[(HeroStatus["RENTAL_MARKET"] = 3)] = "RENTAL_MARKET";
HeroStatus[(HeroStatus["RENTING"] = 2)] = "RENTING";
HeroStatus[(HeroStatus["HIRE"] = 5)] = "HIRE";
// const map = observable.map({ key: "value" });



let HeroRarity = {};

HeroRarity[(HeroRarity["N"] = 1)] = "N";
HeroRarity[(HeroRarity["R"] = 2)] = "R";
HeroRarity[(HeroRarity["SR"] = 3)] = "SR";
HeroRarity[(HeroRarity["SSR"] = 4)] = "SSR";
HeroRarity[(HeroRarity["UR"] = 5)] = "UR";

const heroAddition = {
  N: 5,
  R: 10,
  SR: 20,
  SSR: 30,
  UR: 50,
};

const baseCoin = 0.02 * 28800; // 单块农田基础产量

const Max_Battle_Hero_Number_Limit = 5;

const Hero_Sybthesis_Requirement = {
  [HeroRarity.UR]: {
    quantity: 1000,
    cost: 10000000000000,
  },
  [HeroRarity.SSR]: {
    quantity: 100,
    cost: 100000000000,
  },
  [HeroRarity.SR]: {
    quantity: 20,
    cost: 200000,
  },
  [HeroRarity.R]: {
    quantity: 8,
    cost: 60000,
  },
  [HeroRarity.N]: {
    quantity: 5,
    cost: 10000,
  },
};

// N卡为2000EOCC，R卡为10000EOCC，SR为5万，SSR为30万
const Hero_StarUp_Requirement = {
  [HeroRarity.N]: 2000,
  [HeroRarity.R]: 10000,
  [HeroRarity.SR]: 50000,
  [HeroRarity.SSR]: 300000,
  [HeroRarity.UR]: 30000000,
};

const Hero_Setting = {
  [HeroRarity.N]: {
    Base_Power: 754,
    Power_Growth: 10,
    Max_Hero_Level_Limit: 100,
    Max_Hero_Star_Limit: 2,
    RESET_COST: 1000,
  },

  [HeroRarity.R]: {
    Base_Power: 1090,
    Power_Growth: 15,
    Max_Hero_Level_Limit: 300,
    Max_Hero_Star_Limit: 3,
    RESET_COST: 1000,
  },

  [HeroRarity.SR]: {
    Base_Power: 1937,
    Power_Growth: 20,
    Max_Hero_Level_Limit: 500,
    Max_Hero_Star_Limit: 4,
    RESET_COST: 1000,
  },
  [HeroRarity.SSR]: {
    Base_Power: 4090,
    Power_Growth: 25,
    Max_Hero_Level_Limit: 1000,
    Max_Hero_Star_Limit: 5,
    RESET_COST: 1000,
  },
  [HeroRarity.UR]: {
    Base_Power: 10000,
    Power_Growth: 66,
    Max_Hero_Level_Limit: 2000,
    Max_Hero_Star_Limit: 1,
    RESET_COST: 1000,
  },
};

export {
  HeroStatus,
  HeroRarity,
  heroAddition,
  baseCoin,
  Max_Battle_Hero_Number_Limit,
  Hero_Setting,
  Hero_Sybthesis_Requirement,
  Hero_StarUp_Requirement,
};
