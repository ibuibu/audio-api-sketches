import { Button } from "@chakra-ui/react";
import { Recorder } from "./recorder";
import { cloneBuffer, getIsSmartPhone } from "./util";
import { drawFromChannel } from "./draw";
import { useState } from "react";

export type SamplerSetting = {
  speed: number;
  isReversed: boolean;
  isGateOn: boolean;
  gain: number;
  audioIndex: number;
};

type PropsSampler = {
  ctx: AudioContext;
  recorder: Recorder;
  keyIndex: number;
  setting: SamplerSetting;
  setKeyIndex: React.SetStateAction<any>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const Sampler2 = (props: PropsSampler) => {
  const { ctx, recorder, keyIndex, setting, setKeyIndex, canvasRef } = props;

  const [audioNode, setAudioNode] = useState<AudioBufferSourceNode>();

  const play = () => {
    setKeyIndex(keyIndex);
    const buffer = cloneBuffer(
      ctx,
      recorder.audioBufferList[setting.audioIndex].audioBuffer
    );

    if (setting.isReversed) {
      buffer.getChannelData(0).reverse();
    }

    if (audioNode) audioNode.stop();

    const audioBufferSourceNode = new AudioBufferSourceNode(ctx, {
      buffer,
    });
    const gainNode = ctx.createGain();
    gainNode.gain.value = setting.gain;
    audioBufferSourceNode.connect(gainNode);
    audioBufferSourceNode.playbackRate.value = setting.speed;
    // audioBufferSourceNode.loop = setting.isLoop;

    gainNode.connect(ctx.destination);
    gainNode.connect(recorder.gainNode);

    audioBufferSourceNode.start();

    setAudioNode(audioBufferSourceNode);

    if (canvasRef.current == null) return;
    drawFromChannel(canvasRef.current, buffer.getChannelData(0));
  };

  const stop = () => {
    if (audioNode == null) return;
    if (!setting.isGateOn) return;
    audioNode.stop();
  };

  return (
    <>
      {getIsSmartPhone() ? (
        <canvas
          width="60"
          height="60"
          style={{ display: "inline-block", border: "solid 1px" }}
          onTouchStart={play}
          onTouchEnd={stop}
        />
      ) : (
        <Button m={2} onClick={play}>
          {keyIndex}
        </Button>
      )}
    </>
  );
};
