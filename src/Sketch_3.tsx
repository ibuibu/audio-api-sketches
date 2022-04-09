import { FormEvent, useEffect, useState } from "react";
let audioData: Float32Array[] = [];

export function Sketch_3() {
  const ctx = new AudioContext();
  const [sound, setSound] = useState<AudioBuffer>();
  const [speed, setSpeed] = useState<number>(10);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const SAMPLE_PATH = "/snare.wav";
  const BUFFER_SIZE = 1024;
  const scriptProcessor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);

  useEffect(() => {
    const f = async () => {
      const s = await LoadSample(ctx, SAMPLE_PATH, isReversed);
      setSound(s);
    };
    f();
  }, []);

  const onAudioProcess = (e: AudioProcessingEvent) => {
    var input = e.inputBuffer.getChannelData(0);
    var bufferData = new Float32Array(BUFFER_SIZE);
    for (var i = 0; i < BUFFER_SIZE; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  };

  const handleSlider = (e: FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setSpeed(parseInt(val, 10));
  };

  const recordPlay = () => {
    audioData = [];
    const src = new AudioBufferSourceNode(ctx, { buffer: sound });
    //add
    src.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(ctx.destination);
    //
    src.connect(ctx.destination);
    src.playbackRate.value = speed * 0.1;
    src.start();
    src.onended = () => {
      scriptProcessor.disconnect();
    };
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

  const playRecord = () => {
    console.log("audioData:", audioData);

    const buf = ctx.createBuffer(
      1,
      audioData.length * BUFFER_SIZE,
      ctx.sampleRate
    );
    const channel = buf.getChannelData(0);
    for (var i = 0; i < audioData.length; i++) {
      for (var j = 0; j < BUFFER_SIZE; j++) {
        channel[i * BUFFER_SIZE + j] = audioData[i][j];
      }
    }

    const audioBufferSourceNode = ctx.createBufferSource();
    audioBufferSourceNode.buffer = buf;

    audioBufferSourceNode.connect(ctx.destination);
    audioBufferSourceNode.start();
  };

  return (
    <>
      <h1>AudioBufferSourceNode Speed Record</h1>
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
      <button onClick={recordPlay}>record</button>
      <button onClick={playRecord}>play record</button>
      <p>
        Reverse
        <input onChange={handleReverseClick} type="checkbox" />
      </p>
    </>
  );
}
