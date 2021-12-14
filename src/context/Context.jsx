import { createContext, useContext, useEffect, useRef, useState } from "react";

const PeerContext = createContext();

const API_KEY =
  "trnsl.1.1.20211212T161217Z.0831f8bca96760d5.2c7f958d368ca87a6c7382819e8a13461ccdde94";

const DB_API = "https://peer-db.kushanksriraj.repl.co/";

const DATA_TYPE = {
  MESSAGE: "MESSAGE",
  TYPING_STARTED: "TYPING_STARTED",
  TYPING_STOPPED: "TYPING_STOPPED",
};

const socket = window.io("https://peer-socket-1.kushanksriraj.repl.co");

const peer = new window.Peer({
  config: {
    iceServers: [
      { url: "stun:numb.viagenie.ca:3478" },
      {
        url: "turn:numb.viagenie.ca:3478",
        username: "shreeraj157@gmail.com",
        credential: "Qwerty@123",
      },
    ],
    host: "peer-server.kushanksriraj.repl.co",
    port: 8080,
    path: "/signaling",
    debug: true,
  },
});

function decode(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function encode(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

const replaceStream = (peerConnection, mediaStream) => {
  peerConnection.getSenders().forEach((sender) => {
    if (sender.track.kind === "audio") {
      if (mediaStream.getAudioTracks().length > 0) {
        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
      }
    }
    if (sender.track.kind === "video") {
      if (mediaStream.getVideoTracks().length > 0) {
        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
      }
    }
  });
};

export const ContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [myPeerId, setMyPeerId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [cameraDeviceId, setCameraDeviceId] = useState("null");
  const [micDeviceId, setMicDeviceId] = useState(null);

  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState({
    // true => on, false => off
    myMic: true,
    peerAudio: true,
    myVideo: true,
  });
  const connection = useRef(null);
  const textChannel = useRef(null);
  const getUserMedia = useRef(null);
  const myVideo = useRef(null);
  const peerVideo = useRef(null);

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
      console.log("HERE", translateState.current.state);
      if (translateState.current.state) {
        const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${text}&lang=en-ru`;
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
        toggleVideo
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
