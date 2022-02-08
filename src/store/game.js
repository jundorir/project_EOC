import { makeAutoObservable } from "mobx";
class Game {
  constructor() {
    makeAutoObservable(this);
  }
}

export default new Game();
