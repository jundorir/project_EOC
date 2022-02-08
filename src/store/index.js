import ChainStore from "./chain";
import GameStore from "./game";
import ViewStore from "./view";
import UserStore from "./user";
import TavernStore from "./tavern";
import AudioStore from "./audio";
import LanguageStore from "./language";

const Store = {
  chain: ChainStore,
  userStore: UserStore,
  game: GameStore,
  view: ViewStore,
  tavernStore: TavernStore,
  audioStore: AudioStore,
  languageStore: LanguageStore,
};

export default Store;
