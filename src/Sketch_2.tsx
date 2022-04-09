import { FormEvent, useEffect, useState } from "react";

export function Sketch_2() {
  const ctx = new AudioContext();
  const [sound, setSound] = useState<AudioBuffer>();
  const [speed, setSpeed] = useState<number>(10);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const SAMPLE_PATH = "/snare.wav";

  useEffect(() => {
    const f = async () => {
      const s = await LoadSample(ctx, SAMPLE_PATH, isReversed);
      setSound(s);
    };
    f();
  }, []);

  const handleSlider = (e: FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setSpeed(parseInt(val, 10));
  };

  const handleClick = () => {
    const src = new AudioBufferSourceNode(ctx, { buffer: sound });
    src.connect(ctx.destination);
    src.playbackRate.value = speed * 0.1;
    src.start();
  };

  const handleReverseClick = async (e: FormEvent<HTMLInputElement>) => {
    const isReversed = e.currentTarget.checked;
    setIsReversed(isReversed);
    const s = await LoadSample(ctx, SAMPLE_PATH, isReversed);
    setSound(s);
  };

  async function LoadSample(
    ctx: AudioContext,
    url: String,
    isReversed: boolean
  ) {
    const res = await fetch(url as RequestInfo);
    const arrayBuf = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuf);
    if (isReversed) {
      for (let i = 0; i < buf.numberOfChannels; i++) {
        buf.getChannelData(i).reverse();
      }
    }
    return buf;
  }

  return (
    <>
      <h1>AudioBufferSourceNode Speed</h1>
      <input
        onInput={handleSlider}
        id="slider"
        type="range"
        name="speed"
        min="1"
        max="10"
      />
      <p>{speed / 10}</p>
      <button onClick={handleClick}>snare</button>
      <p>
        Reverse
        <input onChange={handleReverseClick} type="checkbox" />
      </p>
    </>
  );
}
