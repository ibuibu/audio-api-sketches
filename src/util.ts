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

export function cloneBuffer(ctx: AudioContext, buffer: AudioBuffer) {
  const channelData = new Float32Array(buffer.length);
  buffer.copyFromChannel(channelData, 0, 0);

  const newBuffer = ctx.createBuffer(1, buffer.length, ctx.sampleRate);
  const channel = newBuffer.getChannelData(0);
  for (let i = 0; i < channelData.length; i++) {
    channel[i] = channelData[i];
  }

  return newBuffer;
}

export function getIsSmartPhone(): boolean {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}
