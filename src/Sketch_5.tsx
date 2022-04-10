import { useEffect, useState } from "react";

export function Sketch_5() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();
  const [audioDeviceId, setAudioDeviceId] = useState<ConstrainDOMString>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioSrc, setAudioSrc] = useState<string>("");

  useEffect(() => {
    const f = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // to get permission
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setDevices(audioDevices);
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    };
    f();
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudioDeviceId(e.currentTarget.value);
  };

  const start = async () => {
    const constraints: MediaStreamConstraints = {
      audio: { deviceId: audioDeviceId },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    let chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
      console.log('e.data:', e.data);
      const audioURL = window.URL.createObjectURL(e.data);
      console.log('audioURL:', audioURL);
      setAudioSrc(audioURL);
    };
    mediaRecorder.start();
  };

  const stop = () => {
    if (mediaRecorder == null) return;
    mediaRecorder.stop();
  };

  return (
    <>
      <h1>Get User Media</h1>
      <button onClick={start}>record start</button>
      <button onClick={stop}>stop</button>
      {devices == null ? (
        ""
      ) : (
        <PulldownDevices devices={devices} handleOnChange={handleOnChange} />
      )}
      {audioSrc == null ? "" : <audio controls src={audioSrc}></audio>}
    </>
  );
}

type Props = {
  devices: MediaDeviceInfo[];
  handleOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const PulldownDevices = (props: Props) => {
  const { devices, handleOnChange } = props;

  return (
    <>
      <select onChange={handleOnChange}>
        {devices.map((device) => {
          return (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          );
        })}
      </select>
    </>
  );
};
