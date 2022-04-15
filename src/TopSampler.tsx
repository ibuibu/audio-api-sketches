import { useRef } from "react";
import { PageSampler } from "./PageSampler";
import { Recorder } from "./recorder";
import { clearCanvas, drawBufferFromAudioData } from "./draw";

export function TopSampler() {
  const ctx = new AudioContext();
  const recorder = new Recorder(ctx);
  const canvasRef = useRef(null);

  const startRecording = () => {
    recorder.startRecording();
  };

  const stopRecording = () => {
    recorder.stopRecording();
    if (canvasRef.current == null) return;
    drawBufferFromAudioData(ctx, canvasRef.current, recorder.audioData);
  };

  const play = () => {
    recorder.play();
  };

  const stop = () => {
    recorder.stop();
  };

  const clear = () => {
    recorder.clear();
    if (canvasRef.current == null) return;
    clearCanvas(canvasRef.current);
  };

  return (
    <>
      <h1>Sampler</h1>
      <canvas ref={canvasRef} width="1000" height="300" />
      <div>
        <button onClick={startRecording}>startRecording</button>
        <button onClick={stopRecording}>stopRecording</button>
        <button onClick={play}>play</button>
        <button onClick={stop}>stop</button>
        <button onClick={clear}>clear</button>
      </div>
      <PageSampler ctx={ctx} gainNode={recorder.gainNode} />
    </>
  );
}
