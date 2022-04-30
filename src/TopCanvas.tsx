import { useEffect, useRef, useState } from "react";
import { Recorder } from "./recorder";
import { clearCanvas, drawBufferFromAudioData } from "./draw";
import { Microphone } from "./Microphone";
import { SamplerObserver } from "./SamplerObserver";
import { useForceUpdate } from "./util";

const ctx = new AudioContext();
export function TopCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recorder, setRecorder] = useState<Recorder>();
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    const f = async () => {
      const r = await Recorder.build(ctx);
      setRecorder(r);
    };
    f();
  }, []);

  const forceUpdate = useForceUpdate();

  const startRecording = () => {
    setIsRecording(true);
    recorder!.startRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder!.stopRecording();
    if (canvasRef.current == null) return;
    drawBufferFromAudioData(ctx, canvasRef.current, recorder!.audioData);
    forceUpdate();
  };

  const truncate = () => {
    recorder!.truncate();
    if (canvasRef.current == null) return;
    drawBufferFromAudioData(ctx, canvasRef.current, recorder!.audioData);
  };

  const clear = () => {
    recorder!.clear();
    if (canvasRef.current == null) return;
    clearCanvas(canvasRef.current);
  };

  console.log("window.innerWidth:", window.innerWidth);
  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 40}
        height="100"
        style={{ border: "solid 1px" }}
      />

      {recorder ? <Microphone ctx={ctx} gainNode={recorder.gainNode} /> : ""}
      <div>
        {isRecording ? (
          <button className="btn" onClick={stopRecording}>
            Stop
          </button>
        ) : (
          <button className="btn" onClick={startRecording}>
            Record
          </button>
        )}
      </div>
      {canvasRef.current != null && recorder != null ? (
        <SamplerObserver ctx={ctx} recorder={recorder} canvasRef={canvasRef} />
      ) : (
        ""
      )}
    </div>
  );
}
