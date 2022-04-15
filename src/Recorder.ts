export class Recorder {
  ctx: AudioContext;
  public audioData: Float32Array[];
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
  }
}

