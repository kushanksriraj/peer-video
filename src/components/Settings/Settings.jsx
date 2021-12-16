import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePeer } from "../../context/Context";
import { replaceStream } from "../../helper";
import { Footer } from "../Footer";

const Wrapper = styled.div`
  
  bottom: 0;
  width: 100%;
  max-width: 1200px;
  border-top-width: 1px;
  border-color: black;
  border-style: solid;
  border-bottom: none;
  border-left: none;
  border-right: none;
  padding: 0.5rem 0.25rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 0.75rem;
  font-weight: bold;
  display: inline-block;
  width: 7rem;
  height: 2rem;
  cursor: pointer;
  background-color: var(--primary);
  color: white;
  margin: 0.25rem;
`;

const ControlWrapper = styled.div`
  display: flex;
  margin-bottom: 0.25rem;
`;

const Label = styled.label`
  font-size: 12px;
  display: inline-block;
  padding-right: 0.5rem;
  cursor: pointer;
  font-weight: bold;
`;

const Select = styled.select`
  margin-left: 0.5rem;
  cursor: pointer;
  max-width: 120px;
`;

const SelectorWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

export const Settings = () => {
  const {
    setCameraDeviceId,
    setMicDeviceId,
    cameraDeviceId,
    micDeviceId,
    myVideo,
    connection,
    translateState,
    buttonState,
  } = usePeer();

  const [micOptionList, setMicOptionList] = useState([]);
  const [cameraOptionList, setCameraOptionList] = useState([]);
  const [localTranslateState, setLocalTranslateState] = useState(
    translateState.current.state
  );

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameraList = devices.filter((obj) => obj.kind === "videoinput");
      const micList = devices.filter((obj) => obj.kind === "audioinput");

      setCameraOptionList(cameraList);
      setMicOptionList(micList);

      setCameraDeviceId(cameraList[0].deviceId);
      setMicDeviceId(micList[0].deviceId);
    })();
  }, []);

  const toggleTranslate = () => {
    translateState.current.state = !translateState.current.state;
    setLocalTranslateState((prev) => !prev);
  };

  const handleCameraChange = async (e) => {
    const cameraId = e.target.value;
    setCameraDeviceId(cameraId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: cameraId },
      audio: { deviceId: micDeviceId },
    });

    stream.getAudioTracks()[0].enabled = buttonState.myMic;
    stream.getVideoTracks()[0].enabled = buttonState.myVideo;

    myVideo.current.srcObject = stream;
    try {
      replaceStream(connection.current.peerConnection, stream);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMicChange = async (e) => {
    const micId = e.target.value;
    setMicDeviceId(micId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: cameraDeviceId },
      audio: { deviceId: micId },
    });

    stream.getAudioTracks()[0].enabled = buttonState.myMic;
    stream.getVideoTracks()[0].enabled = buttonState.myVideo;

    myVideo.current.srcObject = stream;
    try {
      replaceStream(connection.current.peerConnection, stream);
    } catch (e) {
      console.log(e);
    }
  };

  const renderCameraOptions = () => {
    const list = [];
    cameraOptionList.forEach((camera) => {
      list.push(
        <option key={camera.deviceId} value={camera.deviceId}>
          {camera.label}
        </option>
      );
    });
    return list;
  };

  const renderMicOptions = () => {
    const list = [];
    micOptionList.forEach((mic) => {
      list.push(
        <option key={mic.deviceId} value={mic.deviceId}>
          {mic.label}
        </option>
      );
    });
    return list;
  };

  return (
    <Wrapper>
      <ControlWrapper>
        <Button onClick={toggleTranslate}>
          {localTranslateState ? "Stop Translation" : "Start Translation"}
        </Button>
      </ControlWrapper>

      <SelectorWrapper>
        <Label htmlFor="select-camera">
          Camera:
          <Select id="select-camera" onChange={handleCameraChange}>
            {renderCameraOptions()}
          </Select>
        </Label>
        <Label htmlFor="select-mic">
          Mic:
          <Select id="select-mic" onChange={handleMicChange}>
            {renderMicOptions()}
          </Select>
        </Label>
      </SelectorWrapper>
      <Footer />
    </Wrapper>
  );
};
