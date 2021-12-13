import {
  CallComponent,
  VideoStream,
  Chat,
  Settings,
  Heading,
} from "./components";
// import { usePeer } from "./context/Context";

function App() {
  // const { isConnected, setIsConnected } = usePeer();

  return (
    <div>
      <Heading />
      <CallComponent />
      <VideoStream />
      <Chat />
      <Settings />
    </div>
  );
}

export default App;
