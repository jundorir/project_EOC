import { BaseERC20 } from "./BaseERC20";
import { EmpireMavern } from "./EmpireMavern";
import { Miner } from "./Miner";
import { GameDB } from "./GameDB";
import { BattleRoundSelf } from "./BattleRoundSelf";
import { HeroManager } from "./HeroManager";
import { GuildManager } from "./GuildManager";
import { Market } from "./Market";
import { PropMarket } from "./PropMarket";
import { HeroNFT } from "./HeroNFT";
import { MutilCall } from "./MutilCall";
import { VerifyBattleReward } from "./VerifyBattleReward";
import { verifyGuildFightReward } from "./verifyGuildFightReward";

const abi = {
  BaseERC20,
  EmpireMavern,
  Miner,
  GameDB,
  BattleRoundSelf,
  HeroManager,
  GuildManager,
  Market,
  HeroNFT,
  MutilCall,
  VerifyBattleReward,
  PropMarket,
  verifyGuildFightReward,
};
export {
  BaseERC20,
  EmpireMavern,
  Miner,
  GameDB,
  BattleRoundSelf,
  HeroManager,
  GuildManager,
  Market,
  HeroNFT,
  MutilCall,
  VerifyBattleReward,
  PropMarket,
  verifyGuildFightReward,
};

export default abi;
