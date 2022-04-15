import { useRef } from "react";
import { PageSampler } from "./PageSampler";
import { Recorder } from "./recorder";
import { drawBufferFromAudioData } from "./draw";

export function TopSampler() {
  const ctx = new AudioContext();
  const recorder = new Recorder(ctx);
  const canvasRef = useRef(null);

  const record = () => {
    recorder.record();
  };

  const play = () => {
    recorder.play();
  };

  const stop = () => {
    recorder.stop();
    drawBufferFromAudioData(ctx, canvasRef.current!, recorder.audioData);
  };

  return (
    <>
      <h1>Sampler</h1>
      <canvas ref={canvasRef} width="1000" height="300" />
      <div>
        <button onClick={record}>record</button>
        <button onClick={stop}>stop</button>
        <button onClick={play}>play</button>
      </div>
      <PageSampler ctx={ctx} gainNode={recorder.gainNode} />
    </>
  );
}
