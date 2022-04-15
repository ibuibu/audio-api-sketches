import { PageSampler } from "./PageSampler";
import { Recorder } from "./Recorder";

export function TopSampler() {
  console.log("top");
  const ctx = new AudioContext();
  const recorder = new Recorder(ctx);

  return <PageSampler ctx={ctx} recorder={recorder}/>;
}
