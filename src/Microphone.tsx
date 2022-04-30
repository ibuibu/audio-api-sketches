import { useEffect, useState } from "react";

type MicrophoneProps = {
  ctx: AudioContext;
  gainNode: GainNode;
};

export function Microphone(props: MicrophoneProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();

  const { ctx, gainNode } = props;

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

  const handleOnChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const constraints: MediaStreamConstraints = {
      audio: { deviceId: e.currentTarget.value },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const mediaStreamSource = ctx.createMediaStreamSource(stream);
    mediaStreamSource.connect(gainNode);
  };

  return (
    <>
      {devices == null ? (
        ""
      ) : (
        <div>
          <span className="control-parts-label">Input Device</span>
          <select className="select" onChange={handleOnChange}>
            <option hidden>Select Device</option>
            {devices.map((device) => {
              return (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </>
  );
}
