import { createAudioBuffer } from "./util";
import { BUFFER_SIZE } from "./config";

export class Recorder {
  static BUFFER_SIZE = BUFFER_SIZE;
  private readonly ctx: AudioContext;
  public audioData: Float32Array[];
  public gainNode: GainNode;
  private readonly scriptProcessor: ScriptProcessorNode;
  private audioBufferSourceNode: AudioBufferSourceNode;

  constructor(ctx: AudioContext) {
    this.scriptProcessor = ctx.createScriptProcessor(
      Recorder.BUFFER_SIZE,
      1,
      1
    );
    this.ctx = ctx;
    this.gainNode = ctx.createGain();
    this.audioData = [];
    this.audioBufferSourceNode = ctx.createBufferSource();
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

  startRecording() {
    this.gainNode.connect(this.scriptProcessor);
    this.scriptProcessor.onaudioprocess = this.onAudioProcess.bind(this);
    this.scriptProcessor.connect(this.ctx.destination);
  }

  stopRecording() {
    this.scriptProcessor.onaudioprocess = null;
  }

  play() {
    if (this.audioData.length === 0) return;
    if (this.audioBufferSourceNode.buffer != null) return;
    const buf = createAudioBuffer(this.ctx, this.audioData);
    const audioBufferSourceNode = this.ctx.createBufferSource();
    audioBufferSourceNode.buffer = buf;
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.connect(this.ctx.destination);
    audioBufferSourceNode.start();

    this.audioBufferSourceNode = audioBufferSourceNode;
  }

  stop() {
    this.audioBufferSourceNode.stop();
  }

  clear() {
    this.audioData = [];
  }
}
