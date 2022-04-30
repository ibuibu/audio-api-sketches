import { useEffect, useRef, useState } from "react";
import { Recorder } from "./recorder";
import { Sampler2, SamplerSetting } from "./Sampler2";
import "./style.scss";

type PropsSampler = {
  ctx: AudioContext;
  recorder: Recorder;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export function SamplerObserver(props: PropsSampler) {
  const { ctx, recorder, canvasRef } = props;

  function createSamplerSetting(audioIndex: number) {
    const setting: SamplerSetting = {
      speed: 1,
      isReversed: false,
      isGateOn: false,
      isLoop: false,
      gain: 1,
      audioIndex: audioIndex,
    };
    return setting;
  }

  const [setting_0, setSetting_0] = useState(createSamplerSetting(0));
  const [setting_1, setSetting_1] = useState(createSamplerSetting(1));
  const [setting_2, setSetting_2] = useState(createSamplerSetting(2));
  const [setting_3, setSetting_3] = useState(createSamplerSetting(3));

  const switchRef = useRef<HTMLInputElement>(null);
  const gateCheckBoxRef = useRef<HTMLInputElement>(null);
  const loopCheckBoxRef = useRef<HTMLInputElement>(null);
  const gainRangeRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const testRef = useRef<HTMLSelectElement>(null);

  const settings = [setting_0, setting_1, setting_2, setting_3];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (switchRef.current == null) return;
    if (gateCheckBoxRef.current == null) return;
    if (loopCheckBoxRef.current == null) return;
    if (gainRangeRef.current == null) return;
    if (rangeRef.current == null) return;
    if (testRef.current == null) return;
    switch (selectedIndex) {
      case 0:
        switchRef.current.checked = setting_0.isReversed;
        gainRangeRef.current.value = String(setting_0.gain * 10);
        rangeRef.current.value = String(setting_0.speed * 10);
        gateCheckBoxRef.current.checked = setting_0.isGateOn;
        loopCheckBoxRef.current.checked = setting_0.isLoop;
        testRef.current.selectedIndex = setting_0.audioIndex;
        break;
      case 1:
        switchRef.current.checked = setting_1.isReversed;
        gainRangeRef.current.value = String(setting_1.gain * 10);
        rangeRef.current.value = String(setting_1.speed * 10);
        gateCheckBoxRef.current.checked = setting_1.isGateOn;
        loopCheckBoxRef.current.checked = setting_1.isLoop;
        testRef.current.selectedIndex = setting_1.audioIndex;
        break;
      case 2:
        switchRef.current.checked = setting_2.isReversed;
        gainRangeRef.current.value = String(setting_2.gain * 10);
        rangeRef.current.value = String(setting_2.speed * 10);
        gateCheckBoxRef.current.checked = setting_2.isGateOn;
        loopCheckBoxRef.current.checked = setting_2.isLoop;
        testRef.current.selectedIndex = setting_2.audioIndex;
        break;
      case 3:
        switchRef.current.checked = setting_3.isReversed;
        gainRangeRef.current.value = String(setting_3.gain * 10);
        rangeRef.current.value = String(setting_3.speed * 10);
        gateCheckBoxRef.current.checked = setting_3.isGateOn;
        loopCheckBoxRef.current.checked = setting_3.isLoop;
        testRef.current.selectedIndex = setting_3.audioIndex;
        break;
      default:
    }
  }, [selectedIndex]);

  function handleForm() {
    if (switchRef.current == null) return;
    if (gateCheckBoxRef.current == null) return;
    if (loopCheckBoxRef.current == null) return;
    if (gainRangeRef.current == null) return;
    if (rangeRef.current == null) return;
    if (testRef.current == null) return;
    const setting = {
      isReversed: switchRef.current.checked,
      gain: parseInt(gainRangeRef.current.value, 10) / 10,
      speed: parseInt(rangeRef.current.value, 10) / 10,
      isGateOn: gateCheckBoxRef.current.checked,
      isLoop: loopCheckBoxRef.current.checked,
      audioIndex: testRef.current.selectedIndex,
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
      case 3:
        setSetting_3(setting);
        break;
      default:
    }
  }

  return (
    <>
      <form onChange={handleForm}>
        <div className="control-parts">
          <span className="control-parts-label">Sample</span>
          <select ref={testRef}>
            {recorder.audioBufferList.map((obj, i) => {
              return <option key={i}>{obj.title}</option>;
            })}
          </select>
        </div>
        <div className="control-parts">
          <span className="control-parts-label">Gain</span>
          <input type="range" max="20" min="1" ref={gainRangeRef} />
          {gainRangeRef.current == null
            ? "1"
            : parseInt(gainRangeRef.current.value, 10) / 10}
        </div>
        <div className="control-parts">
          <span className="control-parts-label">Speed</span>
          <input type="range" max="30" min="1" ref={rangeRef} />
          {rangeRef.current == null
            ? "1"
            : parseInt(rangeRef.current.value, 10) / 10}
        </div>
        <div className="checks">
          <div className="control-parts">
            <span className="control-parts-label">Reverse</span>
            <input type="checkbox" ref={switchRef} />
          </div>
          <div className="control-parts">
            <span className="control-parts-label">Gate</span>
            <input type="checkbox" ref={gateCheckBoxRef} />
          </div>
          <div className="control-parts">
            <span className="control-parts-label">Loop</span>
            <input type="checkbox" ref={loopCheckBoxRef} />
          </div>
        </div>
      </form>
      <div className="pads">
        {settings.map((setting, i) => {
          return (
            <Sampler2
              key={i}
              keyIndex={i}
              ctx={ctx}
              recorder={recorder}
              setting={setting}
              setKeyIndex={setSelectedIndex}
              canvasRef={canvasRef}
            />
          );
        })}
      </div>
    </>
  );
}
