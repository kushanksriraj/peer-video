import styled from "styled-components";
import { usePeer } from "../../context/Context";
import { MyStream } from "./MyStream";

const Wrapper = styled.div`
  margin: 0.25rem;
  margin-top: 2.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  border-radius: 5px;
  background-color: var(--primary);
  color: white;
  height: 60vh;
  max-height: 1200px;
  position: relative;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 0.70rem;
  font-weight: bold;
  display: inline-block;
  width: 4rem;
  height: 1.5rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.variant === "end" ? "red" : "gray"};
  color: white;
  margin: 0.25rem;
  margin-right: 0.75rem;
`;

const ControlWrapper = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  border: 1px solid var(--primary);
  border-radius: 2px;
  display: flex;
`;

const PeerVideo = styled.video`
  object-fit: contain;
  width: 90%;
  min-width: 90vw;
  height: 90%;
  max-height: 70vh;
`;

export const VideoStream = () => {
  const { peerVideo, buttonState, setButtonState } = usePeer();

  const endCall = () => {
    window.location.reload();
  };

  const toggleAudioState = () => {
    if (buttonState.peerAudio) {
      peerVideo.current.muted = true;
      setButtonState((prev) => ({
        ...prev,
        peerAudio: false,
      }));
    } else {
      peerVideo.current.muted = false;
      setButtonState((prev) => ({
        ...prev,
        peerAudio: true,
      }));
    }
  };

  return (
    <Wrapper>
      <MyStream />
      <ControlWrapper>
        <Button variant="end" onClick={endCall}>
          End
        </Button>
        <Button onClick={toggleAudioState}>
          {buttonState.peerAudio ? "Audio off" : "Audio on"}
        </Button>
      </ControlWrapper>
      <PeerVideo
        ref={peerVideo}
        autoPlay
      ></PeerVideo>
    </Wrapper>
  );
};
