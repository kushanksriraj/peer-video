import {
  CallComponent,
  VideoStream,
  Chat,
  Settings,
  Heading,
} from "./components";

function App() {
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
