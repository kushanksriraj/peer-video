import styled from "styled-components";

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
  return (
    <Wrapper>
      <MyVideo
        autoPlay
        width="100px"
        height="130px"
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
      ></MyVideo>
	  <ControlWrapper>
        <Button variant="end">Mute</Button>
        <Button>Video off</Button>
      </ControlWrapper>
    </Wrapper>
  );
};
