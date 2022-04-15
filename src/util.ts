import { BUFFER_SIZE } from "./config";

export function createAudioBuffer(
  ctx: AudioContext,
  audioData: Float32Array[]
): AudioBuffer {
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
  return buf;
}
