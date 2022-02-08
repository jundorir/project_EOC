import { makeAutoObservable } from "mobx";
import bgMusic from "@assets/audio/bg.mp3";
import clickMusic from "@assets/audio/click.mp3";
// // const fight = https://media.eocryptoken.com:90/static/media/fight_bg.ac77ad09.mp3
// // const battle = https://media.eocryptoken.com:90/static/media/battle_hero_pk.ff56561d.mp3
// const bgMusic = "https://media.eocryptoken.com:90/static/media/bg.3a894bbd.mp3";
// const clickMusic =
//   "https://media.eocryptoken.com:90/static/media/click.c8e3b594.mp3";
class Audio {
  bgAudioMusic = bgMusic;
  clickAudioMusic = clickMusic;
  bgIsPlay = false;
  voice = "0";

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  init() {
    const config = localStorage.getItem("voice");
    if (!!config || config !== null) {
      console.log(config);
      this.voice = config;
    } else {
      this.changeVoice(50);
    }
  }
  changeVoice(voice) {
    localStorage.setItem("voice", voice);
    this.voice = voice;
  }

  playBg() {
    this.bgIsPlay = true;
  }
}

export default new Audio();
