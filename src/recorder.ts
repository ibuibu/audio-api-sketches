import { createAudioBuffer } from "./util";
import { BUFFER_SIZE } from "./config";

export type AudioBufferObject = {
  title: string;
  audioBuffer: AudioBuffer;
};

export class Recorder {
  static BUFFER_SIZE = BUFFER_SIZE;
  private readonly ctx: AudioContext;
  public audioBufferList: AudioBufferObject[];
  public audioData: Float32Array[];
  public gainNode: GainNode;
  private readonly scriptProcessor: ScriptProcessorNode;
  private audioBufferSourceNode: AudioBufferSourceNode;
  private isPlaying: boolean = false;

  constructor(ctx: AudioContext) {
    this.scriptProcessor = ctx.createScriptProcessor(
      Recorder.BUFFER_SIZE,
      1,
      1
    );
    this.ctx = ctx;
    this.gainNode = ctx.createGain();
    this.audioData = [];
    this.audioBufferList = [];
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

  public static async build(ctx: AudioContext): Promise<Recorder> {
    const recorder = new Recorder(ctx);
    const urls = ["/kick.wav", "/snare.wav", "/hihat.wav", "/guitar.wav"];
    for (const url of urls) {
      recorder.audioBufferList.push({
        title: url,
        audioBuffer: await this.LoadSample(ctx, url),
      });
    }
    return recorder;
  }

  private static async LoadSample(ctx: AudioContext, url: String) {
    const res = await fetch(url as RequestInfo);
    const arrayBuf = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuf);
    return buf;
  }

  startRecording() {
    this.gainNode.connect(this.scriptProcessor);
    this.scriptProcessor.onaudioprocess = this.onAudioProcess.bind(this);
    this.scriptProcessor.connect(this.ctx.destination);
  }

  stopRecording() {
    this.scriptProcessor.onaudioprocess = null;
    const newData = createAudioBuffer(this.ctx, this.audioData);
    this.audioBufferList.push({
      title: Date.now().toString(),
      audioBuffer: newData,
    });
    console.log(this.audioBufferList);
  }

  play() {
    if (this.audioData.length === 0) return;
    if (this.isPlaying) return;
    const buffer = createAudioBuffer(this.ctx, this.audioData);
    const audioBufferSourceNode = new AudioBufferSourceNode(this.ctx, {
      buffer,
    });
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.connect(this.ctx.destination);
    audioBufferSourceNode.start();

    this.audioBufferSourceNode = audioBufferSourceNode;
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying) return;
    this.audioBufferSourceNode.stop();
    this.isPlaying = false;
  }

  truncate() {
    let start = 0;
    let end = this.audioData.length;
    for (let i = 0; i < this.audioData.length; i++) {
      if (this.audioData[i][0] !== 0) {
        start = i;
        break;
      }
    }
    console.log("a");
    for (let i = this.audioData.length - 1; i > start; i--) {
      if (this.audioData[i][0] !== 0) {
        end = i;
        break;
      }
    }
    const tmp = this.audioData.slice(start, end);
    this.audioData = [];
    this.audioData = tmp;
  }

  clear() {
    this.audioData = [];
  }
}
