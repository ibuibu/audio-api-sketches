import { BUFFER_SIZE } from "./config";

export function drawBuffer(
  canvas: HTMLCanvasElement,
  bufferNode: AudioBufferSourceNode
) {
  const buf = bufferNode.buffer;
  if (buf == null) {
    console.warn("buffer is null");
    return;
  }
  const channel = buf.getChannelData(0);
  drawFromChannel(canvas, channel);
}

export function drawBufferFromAudioData(
  ctx: AudioContext,
  canvas: HTMLCanvasElement,
  audioData: Float32Array[]
) {
  if (audioData.length === 0) return;
  const buf = ctx.createBuffer(
    1,
    audioData.length * BUFFER_SIZE,
    ctx.sampleRate
  );
  const channel = buf.getChannelData(0);
  for (let i = 0; i < audioData.length; i++) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
      channel[i * BUFFER_SIZE + j] = audioData[i][j];
    }
  }

  const audioBufferSourceNode = ctx.createBufferSource();
  audioBufferSourceNode.buffer = buf;

  drawFromChannel(canvas, channel);
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const c = canvas.getContext("2d");
  if (c == null) return;
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFromChannel(canvas: HTMLCanvasElement, channel: Float32Array) {
  const peaks = getPeaks(channel, canvas.width - 10); // buffer

  const c = canvas.getContext("2d");
  if (c == null) return;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  for (let i = 0; i < peaks.length; i++) {
    c.fillRect(i, canvas.height / 2, 1, (peaks[i] * canvas.height) / 2.1); // buffer
    c.fillRect(i, canvas.height / 2, 1, (peaks[i] * -canvas.height) / 2.1);
  }
}

function getPeaks(array: Float32Array, peakLength: number): number[] {
  let step;
  if (!peakLength) {
    peakLength = 9000;
  }

  step = Math.floor(array.length / peakLength);

  if (step < 1) {
    step = 1;
  }
  let peaks = [];
  for (let i = 0, len = array.length; i < len; i += step) {
    const peak = getPeak(array, i, i + step);
    peaks.push(peak);
  }
  return peaks;
}

function getPeak(array: Float32Array, startIndex: number, endIndex: number) {
  const slicedArray = array.slice(startIndex, endIndex);
  const peak = slicedArray.reduce((a, b) => {
    return Math.max(a, b);
  });
  return peak;
}
