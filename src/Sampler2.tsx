import { Button } from "@chakra-ui/react";
import { Recorder } from "./recorder";
import { cloneBuffer, getIsSmartPhone } from "./util";

export type SamplerSetting = {
  speed: number;
  isReversed: boolean;
  audioIndex: number;
};

type PropsSampler = {
  ctx: AudioContext;
  recorder: Recorder;
  keyIndex: number;
  setting: SamplerSetting;
  setKeyIndex: React.SetStateAction<any>;
};

export const Sampler2 = (props: PropsSampler) => {
  const { ctx, recorder, keyIndex, setting, setKeyIndex } = props;

  const play = () => {
    setKeyIndex(keyIndex);
    const buffer = cloneBuffer(
      ctx,
      recorder.audioBufferList[setting.audioIndex].audioBuffer
    );

    if (setting.isReversed) {
      buffer.getChannelData(0).reverse();
    }

    const audioBufferSourceNode = new AudioBufferSourceNode(ctx, {
      buffer,
    });
    audioBufferSourceNode.connect(ctx.destination);
    audioBufferSourceNode.connect(recorder.gainNode);
    audioBufferSourceNode.playbackRate.value = setting.speed;
    // audioBufferSourceNode.loop = setting.isLoop;
    audioBufferSourceNode.start();
  };

  return (
    <>
      {getIsSmartPhone() ? (
        <canvas
          width="60"
          height="60"
          style={{ display: "inline-block", border: "solid 1px" }}
          onTouchStart={play}
        />
      ) : (
        <Button m={2} onClick={play}>
          {keyIndex}
        </Button>
      )}
    </>
  );
};
