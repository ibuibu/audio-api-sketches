import { useEffect, useState } from 'react';

export function Sketch_1() {
  const ctx = new AudioContext();
  const [sound, setSound] = useState<AudioBuffer>();

  useEffect(() => {
    const f = async () => {
      const s = await LoadSample(ctx, '/snare.wav');
      setSound(s);
    };
    f();
  }, []);

  const handleClick = () => {
    const src = new AudioBufferSourceNode(ctx, { buffer: sound });
    src.connect(ctx.destination);
    src.start();
  };

  async function LoadSample(ctx: AudioContext, url: String) {
    const res = await fetch(url as RequestInfo);
    const arrayBuf = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuf);
    return buf;
  }

  return (
    <>
      <h1>AudioBufferSourceNode</h1>
      <button onClick={handleClick}>snare</button>
    </>
  );
}
