import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Recorder } from "./recorder";
import { createAudioBuffer } from "./util";

export type SamplerSetting = {
  speed: number;
  isReversed: boolean;
};

type PropsSampler = {
  ctx: AudioContext;
  recorder: Recorder;
  keyIndex: number;
  isCopyMode: boolean;
  setIsCopyMode: React.SetStateAction<any>;
  setting: SamplerSetting;
  setKeyIndex: React.SetStateAction<any>;
};

export const Sampler2 = (props: PropsSampler) => {
  const {
    ctx,
    recorder,
    keyIndex,
    isCopyMode,
    setIsCopyMode,
    setting,
    setKeyIndex,
  } = props;
  const [audioData, setAudioData] = useState<Float32Array[]>();

  const play = () => {
    setKeyIndex(keyIndex);
    if (audioData == null) return;
    const buffer = createAudioBuffer(ctx, audioData);
    if (setting.isReversed) {
      buffer.getChannelData(0).reverse();
    }
    const audioBufferSourceNode = new AudioBufferSourceNode(ctx, { buffer });
    audioBufferSourceNode.connect(ctx.destination);
    audioBufferSourceNode.playbackRate.value = setting.speed;
    // audioBufferSourceNode.loop = setting.isLoop;
    audioBufferSourceNode.start();
  };

  const copy = () => {
    if (recorder.audioData.length === 0) return;
    setKeyIndex(keyIndex);
    setAudioData(recorder.audioData);
    setIsCopyMode(false);
  };

  return (
    <>
      {isCopyMode ? (
        <Button m={2} onClick={copy} colorScheme="blue">
          {keyIndex}
        </Button>
      ) : (
        <Button
          m={2}
          onClick={play}
          colorScheme={audioData == null ? "blackAlpha" : "green"}
        >
          {keyIndex}
        </Button>
      )}
    </>
  );
};
