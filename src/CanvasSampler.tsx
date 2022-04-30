import { useEffect, useState } from "react";
import "./style.scss";

type PropsSampler = {
  ctx: AudioContext;
  char: string;
  soundFilePath: string;
  setFuncObj: React.SetStateAction<any>;
  gainNode: GainNode;
};

export const CanvasSampler = (props: PropsSampler) => {
  const { ctx, char, soundFilePath, setFuncObj, gainNode } = props;

  const [sound, setSound] = useState<AudioBuffer>();
  const [isSmartPhone, setIsSmartPhone] = useState<boolean>();

  useEffect(() => {
    const f = async () => {
      const s = await LoadSample(ctx, soundFilePath);
      setSound(s);
      setFuncObj({ fn: () => play(s) });
    };
    f();
    setIsSmartPhone(getIsSmartPhone());
  }, []);

  const play = (sound: AudioBuffer) => {
    const src = new AudioBufferSourceNode(ctx, { buffer: sound });
    src.connect(ctx.destination);
    src.connect(gainNode);
    src.start();
  };

  const handleClick = () => {
    if (sound == null) return;
    play(sound);
  };

  async function LoadSample(ctx: AudioContext, url: String) {
    const res = await fetch(url as RequestInfo);
    const arrayBuf = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuf);
    return buf;
  }

  function getIsSmartPhone(): boolean {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {isSmartPhone ? (
        <canvas
          width="60"
          height="60"
          style={{ display: "inline-block", border: "solid 1px" }}
          onTouchStart={handleClick}
        />
      ) : (
        <button className="btn" onClick={handleClick}>
          {char}
        </button>
      )}
    </>
  );
};
