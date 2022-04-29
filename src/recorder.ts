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
