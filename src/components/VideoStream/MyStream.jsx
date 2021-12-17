import { useState } from "react";
import styled from "styled-components";
import { usePeer } from "../../context/Context";
import { DATA_TYPE } from "../../helper";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 0;
  max-height: 160px;
  width: 200px;
  max-width: 35vw;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 50;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: bold;
  display: inline-block;
  width: 4rem;
  height: 1.5rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.variant === "end" ? "red" : "var(--primary)"};
  color: white;
  margin: 0.2rem;
  margin-left: 0.5rem;
`;

const ControlWrapper = styled.div`
  position: absolute;
  top: -32px;
  right: 0;
  display: flex;
  z-index: 30;
`;

const MyVideo = styled.video`
  object-fit: contain;
  width: 95%;
`;

export const MyStream = () => {
  const {
    myVideo,
    buttonState,
    setButtonState,
    toggleMic,
    toggleVideo,
    textChannel,
  } = usePeer();

  const [loading, setLoading] = useState(false);
  const [mirror, setMirror] = useState(false);

  const toggleMyMicState = async () => {
    if (buttonState.myMic) {
      setLoading(true);
      await toggleMic(false);
      setButtonState((prev) => ({
        ...prev,
        myMic: false,
      }));
      setLoading(false);
    } else {
      setLoading(true);
      await toggleMic(true);
      setButtonState((prev) => ({
        ...prev,
        myMic: true,
      }));
      setLoading(false);
    }
  };

  const toggleMyVideoState = async () => {
    if (buttonState.myVideo) {
      setLoading(true);
      await toggleVideo(false);
      setButtonState((prev) => ({
        ...prev,
        myVideo: false,
      }));
      setLoading(false);
      myVideo.current.style.display = "none";
    } else {
      setLoading(true);
      await toggleVideo(true);
      setButtonState((prev) => ({
        ...prev,
        myVideo: true,
      }));
      setLoading(false);
      myVideo.current.style.display = "block";
    }
  };

  const toggleMirror = () => {
    let data = {};

    if (mirror) {
      data.type = DATA_TYPE.MIRROR_OFF;
      myVideo.current.classList.remove("mirror");
    } else {
      data.type = DATA_TYPE.MIRROR_ON;
      myVideo.current.classList.add("mirror");
    }

    setMirror((prev) => !prev);

    try {
      textChannel.current.send(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <MyVideo
        ref={myVideo}
        autoPlay
        muted
      ></MyVideo>
      <ControlWrapper>
        <Button onClick={toggleMirror}>
          {mirror ? "Mirror off" : "Mirror on"}
        </Button>
        <Button variant="end" onClick={toggleMyMicState} disabled={loading}>
          {buttonState.myMic ? "Mute" : "Unmute"}
        </Button>
        <Button onClick={toggleMyVideoState} disabled={loading}>
          {buttonState.myVideo ? "Video off" : "Video on"}
        </Button>
      </ControlWrapper>
    </Wrapper>
  );
};
