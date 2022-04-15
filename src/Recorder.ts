export class Recorder {
  ctx: AudioContext;
  audioData: Float32Array[];
  gainNode: GainNode;
  static BUFFER_SIZE = 1024;
  private readonly scriptProcessor: ScriptProcessorNode;

  constructor(ctx: AudioContext) {
    this.scriptProcessor = ctx.createScriptProcessor(
      Recorder.BUFFER_SIZE,
      1,
      1
    );
    this.ctx = ctx;
    this.gainNode = ctx.createGain();
    this.audioData = [];
  }

  onAudioProcess(e: AudioProcessingEvent) {
    console.log("recording");
    const input = e.inputBuffer.getChannelData(0);
    const bufferData = new Float32Array(Recorder.BUFFER_SIZE);
    for (var i = 0; i < Recorder.BUFFER_SIZE; i++) {
      bufferData[i] = input[i];
    }
    this.audioData.push(bufferData);
  }

  record() {
    this.audioData = [];
    this.gainNode.connect(this.scriptProcessor);
    this.scriptProcessor.onaudioprocess = this.onAudioProcess.bind(this);
    this.scriptProcessor.connect(this.ctx.destination);
  }

  stop() {
    this.scriptProcessor.onaudioprocess = null;
  }

  play() {
    const buf = this.ctx.createBuffer(
      1,
      this.audioData.length * Recorder.BUFFER_SIZE,
      this.ctx.sampleRate
    );
    const channel = buf.getChannelData(0);
    for (var i = 0; i < this.audioData.length; i++) {
      for (var j = 0; j < Recorder.BUFFER_SIZE; j++) {
        channel[i * Recorder.BUFFER_SIZE + j] = this.audioData[i][j];
      }
    }

    const audioBufferSourceNode = this.ctx.createBufferSource();
    audioBufferSourceNode.buffer = buf;

    audioBufferSourceNode.connect(this.ctx.destination);
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.start();

    const peaks = getPeaks(channel, 1000);
    drawWaveform(peaks);
  }
}

const drawWaveform = (peaks: number[]): void => {
  const canvas = document.querySelector("canvas");
  if (canvas == null) return;
  const c = canvas!.getContext("2d");
  if (c == null) return;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  for (let i = 0; i < peaks.length; i++) {
    c.fillRect(i, 150, 1, peaks[i] * 100);
    c.fillRect(i, 150, 1, peaks[i] * -100);
  }
};

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
