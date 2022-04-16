import { useRef } from "react";
import { PageSampler } from "./PageSampler";
import { Recorder } from "./recorder";
import { clearCanvas, drawBufferFromAudioData } from "./draw";
import { Heading, Box, Button, ButtonGroup } from "@chakra-ui/react";

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
    <Box m={2}>
      <Heading>Sampler</Heading>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 20}
        height="100"
        style={{ border: "solid 1px" }}
      />
      <ButtonGroup m={2}>
        <Button onClick={startRecording}>startRecording</Button>
        <Button onClick={stopRecording}>stopRecording</Button>
        <Button onClick={play}>play</Button>
        <Button onClick={stop}>stop</Button>
        <Button onClick={clear}>clear</Button>
      </ButtonGroup>
      <PageSampler ctx={ctx} gainNode={recorder.gainNode} />
    </Box>
  );
}
