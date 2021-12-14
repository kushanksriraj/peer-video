import { useState } from "react";
import styled from "styled-components";
import { usePeer } from "../../context/Context";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: var(--primary);
  color: white;
  height: 20vh;
  max-height: 140px;
  width: 110px;
  position: absolute;
  top: 0px;
  right: 0px;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 8px;
  font-weight: bold;
  display: inline-block;
  width: 50px;
  height: 18px;
  cursor: pointer;
  background-color: ${(props) =>
    props.variant === "end" ? "red" : "var(--primary)"};
  color: white;
  margin: 0.2rem;
`;

const ControlWrapper = styled.div`
  position: absolute;
  top: -25px;
  right: 0;
  display: flex;
`;

const MyVideo = styled.video`
  object-fit: contain;
`;

export const MyStream = () => {
  const { myVideo, buttonState, setButtonState, toggleMic, toggleVideo } =
    usePeer();
  const [loading, setLoading] = useState(false);

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

  return (
    <Wrapper>
      <MyVideo
        ref={myVideo}
        autoPlay
        muted
        width="100px"
        height="130px"
      ></MyVideo>
      <ControlWrapper>
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
