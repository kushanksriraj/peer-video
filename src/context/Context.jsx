import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  DATA_TYPE,
  decode,
  encode,
  replaceStream,
  SOCKET_URL,
  STUN_URL,
  TURN_URL,
  TURN_USERNAME,
  TURN_CREDENTIAL,
  PEER_SERVER_URL,
  PEER_SERVER_PORT,
  PEER_SERVER_PATH,
  getTranslationURL,
} from "../helper";

const PeerContext = createContext();

const socket = window.io(SOCKET_URL);

const peer = new window.Peer({
  config: {
    iceServers: [
      { url: STUN_URL },
      {
        url: TURN_URL,
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL,
      },
    ],
    host: PEER_SERVER_URL,
    port: PEER_SERVER_PORT,
    path: PEER_SERVER_PATH,
    debug: true,
  },
});

export const ContextProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [myPeerId, setMyPeerId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [micDeviceId, setMicDeviceId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cameraDeviceId, setCameraDeviceId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [buttonState, setButtonState] = useState({
    myMic: true,
    peerAudio: true,
    myVideo: true,
  });
  const myVideo = useRef(null);
  const peerVideo = useRef(null);
  const connection = useRef(null);
  const textChannel = useRef(null);
  const getUserMedia = useRef(null);
  const translateState = useRef({ state: false });

  useEffect(() => {
    peer.on("open", (id) => {
      setMyPeerId(id);
    });

    getUserMedia.current =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
  }, []);

  useEffect(() => {
    socket.on("peer-id", (data) => {
      const res = window.confirm("Accept call from " + data.username + " ?");

      if (res) {
        const otherId = data.id;
        getUserMedia.current(
          { video: true, audio: true },
          function (stream) {
            myVideo.current.srcObject = stream;
            const call = peer.call(otherId, stream);
            connection.current = call;
            call.on("stream", function (remoteStream) {
              peerVideo.current.srcObject = remoteStream;
            });
          },
          function (err) {
            console.log("Failed to get local stream", err);
          }
        );

        textChannel.current = peer.connect(otherId, {
          metadata: {
            username: myPeerId,
          },
        });
        textChannel.current.on("data", handleMessage);
      }
    });
  }, []);

  useEffect(() => {
    peer.on("call", function (call) {
      connection.current = call;
      call.on("data", handleMessage);
      getUserMedia.current(
        { video: true, audio: true },
        function (stream) {
          call.answer(stream);
          myVideo.current.srcObject = stream;
          call.on("stream", function (remoteStream) {
            peerVideo.current.srcObject = remoteStream;
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });
  }, []);

  useEffect(() => {
    peer.on("connection", function (conn) {
      textChannel.current = conn;
      conn.on("data", handleMessage);
    });
  }, []);

  async function handleMessage(data) {
    if (data.type === DATA_TYPE.MIRROR_ON) {
      peerVideo.current.className = "mirror";
      return;
    }

    if (data.type === DATA_TYPE.MIRROR_OFF) {
      peerVideo.current.className = "";
      return;
    }

    if (data.type === DATA_TYPE.TYPING_STARTED) {
      setIsTyping(true);
      return;
    }

    if (data.type === DATA_TYPE.TYPING_STOPPED) {
      setIsTyping(false);
      return;
    }

    if (data.type === DATA_TYPE.MESSAGE) {
      let text = decode(data.text);
      if (translateState.current.state) {
        const url = getTranslationURL(text);
        const res = await fetch(url);
        const resData = await res.json();
        const eng = text;
        text = resData.text[0];

        if (data.from !== myPeerId) {
          setMessageList((prev) => [
            ...prev,
            {
              text: eng,
              translation: text,
            },
          ]);
        }
      } else {
        if (data.from !== myPeerId) {
          setMessageList((prev) => [
            ...prev,
            {
              text,
            },
          ]);
        }
      }
    }
  }

  const callOnClick = () => {
    socket.emit("call", {
      username,
      id: myPeerId,
      roomId,
    });
  };

  const sendMsg = (e) => {
    e.preventDefault();

    const text = message;

    const typing_info = {
      type: DATA_TYPE.TYPING_STOPPED,
    };

    const data = {
      type: DATA_TYPE.MESSAGE,
      from: myPeerId,
      text: encode(text),
    };
    try {
      textChannel.current.send(typing_info);
      textChannel.current.send(data);
    } catch (e) {
      console.log(e);
    }

    setMessageList((prev) => [
      ...prev,
      {
        text,
      },
    ]);

    setMessage("");
  };

  const updateMessage = (e) => {
    setMessage(e.target.value);

    const data = {
      type: DATA_TYPE.TYPING_STARTED,
    };
    try {
      textChannel.current.send(data);
    } catch (e) {
      console.log(e);
    }

    if (e.target.value === "") {
      const data = {
        type: DATA_TYPE.TYPING_STOPPED,
      };
      try {
        textChannel.current.send(data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  async function toggleMic(state) {
    if (state) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: cameraDeviceId },
        audio: { deviceId: micDeviceId },
      });
      stream.getAudioTracks()[0].enabled = true;
      try {
        replaceStream(connection.current.peerConnection, stream);
      } catch (e) {
        console.log(e);
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: cameraDeviceId },
        audio: { deviceId: micDeviceId },
      });
      stream.getAudioTracks()[0].enabled = false;
      try {
        replaceStream(connection.current.peerConnection, stream);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function toggleVideo(state) {
    if (state) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: cameraDeviceId },
        audio: { deviceId: micDeviceId },
      });
      stream.getVideoTracks()[0].enabled = true;
      try {
        replaceStream(connection.current.peerConnection, stream);
      } catch (e) {
        console.log(e);
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: cameraDeviceId },
        audio: { deviceId: micDeviceId },
      });
      stream.getVideoTracks()[0].enabled = false;
      try {
        replaceStream(connection.current.peerConnection, stream);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const joinRoom = () => {
    socket.emit("join-room", {
      roomId,
    });
  };

  return (
    <PeerContext.Provider
      value={{
        isConnected,
        setIsConnected,
        username,
        setUsername,
        callOnClick,
        cameraDeviceId,
        micDeviceId,
        setCameraDeviceId,
        setMicDeviceId,
        myVideo,
        connection,
        peerVideo,
        messageList,
        translateState,
        myPeerId,
        sendMsg,
        message,
        setMessage,
        updateMessage,
        isTyping,
        buttonState,
        setButtonState,
        toggleMic,
        toggleVideo,
        textChannel,
        roomId,
        setRoomId,
        joinRoom,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  const data = useContext(PeerContext);
  return { ...data };
};
