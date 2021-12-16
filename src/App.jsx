import { useEffect } from "react";
import styled from "styled-components";
import { usePeer } from "./context/Context";
import {
  CallComponent,
  VideoStream,
  Chat,
  Settings,
  Heading,
} from "./components";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  background-color: #dfdfdfdb;
  top: 60px;
  max-width: 1200px;
  width: 100%;
  height: calc(100vh - 110px);
  overflow: hidden;
  /* margin-bottom: 20px; */
`;

function App() {
  const { isConnected } = usePeer();

  useEffect(() => {
    if (isConnected) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
  }, [isConnected]);

  return (
    <div>
      <Heading />
      {!isConnected && (
        <Modal>
          <CallComponent />
        </Modal>
      )}
      <VideoStream />
      <Chat />
      <Settings />
    </div>
  );
}

export default App;
