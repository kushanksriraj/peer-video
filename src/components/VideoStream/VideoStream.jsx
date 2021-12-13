import styled from "styled-components";
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
  height: 50vh;
  max-height: 400px;
  position: relative;
`;

const Label = styled.label`
  font-size: smaller;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  display: inline-block;
  width: 56px;
  height: 18px;
  cursor: pointer;
  background-color: ${(props) =>
    props.variant === "end" ? "red" : "var(--primary)"};
  color: white;
  margin: 0.25rem;
`;

const ControlWrapper = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  border: 1px solid red;
  border-radius: 2px;
  display: flex;
`;

const PeerVideo = styled.video`
  object-fit: contain;
`;

export const VideoStream = () => {
  return (
    <Wrapper>

	  <MyStream />

      <ControlWrapper>
        <Button variant="end">End</Button>
        <Button>Audio off</Button>
      </ControlWrapper>

      <PeerVideo
        autoPlay
        width="400px"
        height="200px"
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      ></PeerVideo>

    </Wrapper>
  );
};

// http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4