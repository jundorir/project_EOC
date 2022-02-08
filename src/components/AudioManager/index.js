import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import { inject, observer } from "mobx-react";

function AudioManager(props) {
  const { audioStore } = props;
  const clickAudio = useRef("clickAudio");
  const bgAudio = useRef("bgAudio");
  function captureClickEvent() {
    if (!audioStore.bgIsPlay) {
      bgAudio.current.play();
      audioStore.playBg();
    }
    clickAudio.current.play();
  }

  useEffect(() => {
    bgAudio.current = new Howl({
      src: [audioStore.bgAudioMusic],
      html5: true,
      autoplay: false,
      volume: 1,
      loop: true,
    });

    clickAudio.current = new Howl({
      src: [audioStore.clickAudioMusic],
      html5: true,
      autoplay: false,
      volume: 1,
    });
    document.addEventListener("click", captureClickEvent, true);
    return () => {
      document.removeEventListener("click", captureClickEvent, true);
    };
  }, []);

  useEffect(() => {
    // 全局设置音量
    Howler.volume(audioStore.voice / 100);
  }, [audioStore.voice]);
  return null;
}

export default inject("audioStore")(observer(AudioManager));
