import { useRef } from "react";
import { PageSampler } from "./PageSampler";
import { Recorder } from "./recorder";
import { clearCanvas, drawBufferFromAudioData } from "./draw";
import { Heading, Box, Button } from "@chakra-ui/react";
import { Microphone } from "./Microphone";
import { SamplerObserver } from "./SamplerObserver";

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

  const truncate = () => {
    recorder.truncate();
    if (canvasRef.current == null) return;
    drawBufferFromAudioData(ctx, canvasRef.current, recorder.audioData);
  };

  const clear = () => {
    recorder.clear();
    if (canvasRef.current == null) return;
    clearCanvas(canvasRef.current);
  };

  return (
    <Box m={2}>
      <Heading>Sampler</Heading>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 20}
        height="100"
        style={{ border: "solid 1px" }}
      />

      <Microphone ctx={ctx} gainNode={recorder.gainNode} />

      <Box flexWrap={"wrap"}>
        <Button m="2" onClick={startRecording}>
          startRecording
        </Button>
        <Button m="2" onClick={stopRecording}>
          stopRecording
        </Button>
        <Button m="2" onClick={play}>
          play
        </Button>
        <Button m="2" onClick={stop}>
          stop
        </Button>
        <Button m="2" onClick={clear}>
          clear
        </Button>
        <Button m="2" onClick={truncate}>
          truncate
        </Button>
      </Box>
      <SamplerObserver ctx={ctx} recorder={recorder} />
      <PageSampler ctx={ctx} gainNode={recorder.gainNode} />
    </Box>
  );
}
