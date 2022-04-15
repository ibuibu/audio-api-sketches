import { useEffect, useState } from "react";
import { Sampler } from "./Sampler";

type PageSamplerProps = {
  ctx: AudioContext;
  gainNode: GainNode;
};

export function PageSampler(props: PageSamplerProps) {
  const { ctx, gainNode } = props;

  const [funcObj_0, setFuncObj_0] = useState<{ fn: () => void }>({
    fn: () => {},
  });
  const [funcObj_1, setFuncObj_1] = useState<{ fn: () => void }>({
    fn: () => {},
  });
  const [funcObj_2, setFuncObj_2] = useState<{ fn: () => void }>({
    fn: () => {},
  });
  const [funcObj_3, setFuncObj_3] = useState<{ fn: () => void }>({
    fn: () => {},
  });

  const samplerParams = [
    {
      char: "q",
      soundFilePath: "/kick.wav",
      funcObj: funcObj_0,
      setFuncObj: setFuncObj_0,
    },
    {
      char: "w",
      soundFilePath: "/snare.wav",
      funcObj: funcObj_1,
      setFuncObj: setFuncObj_1,
    },
    {
      char: "e",
      soundFilePath: "/hihat.wav",
      funcObj: funcObj_2,
      setFuncObj: setFuncObj_2,
    },
    {
      char: "r",
      soundFilePath: "/clap.wav",
      funcObj: funcObj_3,
      setFuncObj: setFuncObj_3,
    },
  ];

  const samplerProps = samplerParams.map((sp) => {
    const { funcObj, ...props } = sp;
    return props;
  });

  useEffect(
    () => {
      window.onkeydown = (e) => {
        for (const sp of samplerParams) {
          if (e.key === sp.char) {
            sp.funcObj.fn();
          }
        }
      };
    },
    samplerParams.map((sp) => {
      return sp.funcObj;
    })
  );

  return (
    <>
      <div>
        {samplerProps.map((sp, i) => {
          return (
            <Sampler key={i} ctx={ctx} {...sp} gainNode={gainNode} />
          );
        })}
      </div>
    </>
  );
}
