import { useEffect, useState } from "react";

let audioData: Float32Array[] = [];

export function Sketch_6() {
  console.log("render");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();
  const [audioDeviceId, setAudioDeviceId] = useState<ConstrainDOMString>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioSrc, setAudioSrc] = useState<string>("");
  const BUFFER_SIZE = 1024;
  const ctx = new AudioContext();
  const scriptProcessor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);

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

  const onAudioProcess = (e: AudioProcessingEvent) => {
    console.log("hoge");
    var input = e.inputBuffer.getChannelData(0);
    var bufferData = new Float32Array(BUFFER_SIZE);
    for (var i = 0; i < BUFFER_SIZE; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudioDeviceId(e.currentTarget.value);
  };

  const start = async () => {
    const constraints: MediaStreamConstraints = {
      audio: { deviceId: audioDeviceId },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //
    const mediaStreamSource = ctx.createMediaStreamSource(stream);
    mediaStreamSource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(ctx.destination);

    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    mediaRecorder.onstop = () => {
      scriptProcessor.disconnect();
    };

    let chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
      console.log("e.data:", e.data);
      const audioURL = window.URL.createObjectURL(e.data);
      console.log("audioURL:", audioURL);
      setAudioSrc(audioURL);
    };
    mediaRecorder.start();
  };

  const playRecord = () => {
    console.log("audioData:", audioData);
    const buf = ctx.createBuffer(
      1,
      audioData.length * BUFFER_SIZE,
      ctx.sampleRate
    );
    const channel = buf.getChannelData(0);
    for (var i = 0; i < audioData.length; i++) {
      for (var j = 0; j < BUFFER_SIZE; j++) {
        channel[i * BUFFER_SIZE + j] = audioData[i][j];
      }
    }

    const audioBufferSourceNode = ctx.createBufferSource();
    audioBufferSourceNode.buffer = buf;

    audioBufferSourceNode.connect(ctx.destination);
    audioBufferSourceNode.start();
  };

  const stop = () => {
    if (mediaRecorder == null) return;
    mediaRecorder.stop();
  };

  return (
    <>
      <h1>Get User Media - MediaRecorder - ScriptProcessor</h1>
      <button onClick={start}>record start</button>
      <button onClick={stop}>stop</button>
      {devices == null ? (
        ""
      ) : (
        <PulldownDevices devices={devices} handleOnChange={handleOnChange} />
      )}
      {audioSrc == null ? "" : <audio controls src={audioSrc}></audio>}
      <button onClick={playRecord}>play record</button>
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
