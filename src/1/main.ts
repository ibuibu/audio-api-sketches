
(async function () {
  const ctx = new AudioContext();
  const sound = await LoadSample(ctx, "/snare.wav");
  const btn = document.getElementById("playbtn");

  btn!.addEventListener("click", () => {
    const src = new AudioBufferSourceNode(ctx, { buffer: sound });
    src.connect(ctx.destination);
    src.start();
  });

  async function LoadSample(ctx: AudioContext, url: String) {
    const res = await fetch(url as RequestInfo);
    const arrayBuf = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuf);
    return buf;
  }
})();
