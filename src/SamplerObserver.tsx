import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Recorder } from "./recorder";
import { Sampler2, SamplerSetting } from "./Sampler2";

type PropsSampler = {
  ctx: AudioContext;
  recorder: Recorder;
};

export function SamplerObserver(props: PropsSampler) {
  const { ctx, recorder } = props;

  const defaultSamplerSetting: SamplerSetting = {
    speed: 1,
    isReversed: false,
  };

  const [isCopyMode, setIsCopyMode] = useState(false);
  const [setting_0, setSetting_0] = useState(defaultSamplerSetting);
  const [setting_1, setSetting_1] = useState(defaultSamplerSetting);
  const [setting_2, setSetting_2] = useState(defaultSamplerSetting);

  const switchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const settings = [setting_0, setting_1, setting_2];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (switchRef.current == null) return;
    if (inputRef.current == null) return;
    switch (selectedIndex) {
      case 0:
        switchRef.current.checked = setting_0.isReversed;
        inputRef.current.value = String(setting_0.speed);
        break;
      case 1:
        switchRef.current.checked = setting_1.isReversed;
        inputRef.current.value = String(setting_1.speed);
        break;
      case 2:
        switchRef.current.checked = setting_2.isReversed;
        inputRef.current.value = String(setting_2.speed);
        break;
      default:
    }
  }, [selectedIndex]);

  function changeCopyMode() {
    setIsCopyMode(!isCopyMode);
  }

  function handleForm() {
    if (switchRef.current == null) return;
    if (inputRef.current == null) return;
    const setting = {
      speed: parseInt(inputRef.current.value, 10),
      isReversed: switchRef.current.checked,
    };
    switch (selectedIndex) {
      case 0:
        setSetting_0(setting);
        break;
      case 1:
        setSetting_1(setting);
        break;
      case 2:
        setSetting_2(setting);
        break;
      default:
    }
  }

  function test() {}

  return (
    <>
      <Button onClick={test}>test</Button>
      <Button onClick={changeCopyMode}>Assign mode</Button>
      <p>index: {selectedIndex}</p>
      <FormControl onChange={handleForm}>
        <FormLabel>Reverse</FormLabel>
        <input type="checkbox" ref={switchRef} />
        <FormLabel>speed</FormLabel>
        <Input ref={inputRef} />
      </FormControl>
      {settings.map((setting, i) => {
        return (
          <Sampler2
            key={i}
            keyIndex={i}
            ctx={ctx}
            isCopyMode={isCopyMode}
            setIsCopyMode={setIsCopyMode}
            recorder={recorder}
            setting={setting}
            setKeyIndex={setSelectedIndex}
          />
        );
      })}
    </>
  );
}
