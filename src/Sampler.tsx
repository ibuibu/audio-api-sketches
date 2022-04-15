import { useEffect, useState } from "react";

type PropsSampler = {
  ctx: AudioContext;
  char: string;
  soundFilePath: string;
  setFuncObj: React.SetStateAction<any>;
  gainNode: GainNode;
};

export const Sampler = (props: PropsSampler) => {
  const { ctx, char, soundFilePath, setFuncObj, gainNode } = props;

  const [sound, setSound] = useState<AudioBuffer>();

  useEffect(() => {
    const f = async () => {
      const s = await LoadSample(ctx, soundFilePath);
      setSound(s);
      setFuncObj({ fn: () => play(s) });
    };
    f();
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

  return (
    <>
      <button onClick={handleClick}>{char}</button>
    </>
  );
};
