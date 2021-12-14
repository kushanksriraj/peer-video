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

export const ContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [myPeerId, setMyPeerId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [cameraDeviceId, setCameraDeviceId] = useState("null");
  const [micDeviceId, setMicDeviceId] = useState(null);
  const [translateState, setTranslateState] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [buttonState, setButtonState] = useState({
    // true => on, false => off
    myMic: true,
    peerMic: true,
    myVideo: true,
  });
  const connection = useRef(null);
  const textChannel = useRef(null);
  const getUserMedia = useRef(null);
  const myVideo = useRef(null);
  const peerVideo = useRef(null);

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

  function handleMessage(data) {
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

      (async () => {
        if (translateState) {
          const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${text}&lang=en-ru`;
          const res = await fetch(url);
          const resData = await res.json();
          const eng = text;
          text = resData.text[0];

          if (data.from !== myPeerId) {
            // const p1 = document.createElement("P");
            // const p2 = document.createElement("P");
            // const text1 = document.createTextNode(eng);
            // const text2 = document.createTextNode(text);

            // p1.appendChild(text1);
            // p2.appendChild(text2);

            // const li = document.createElement("LI");

            // li.appendChild(p1);
            // li.appendChild(p2);

            // li.className = "she";
            // li.style.display = "block";

            // msgList.appendChild(li);
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
            // const li = document.createElement("LI");
            // const textNode = document.createTextNode(text);
            // li.appendChild(textNode);
            // li.className = "she";
            // msgList.appendChild(li);
            setMessageList((prev) => [
              ...prev,
              {
                text,
              },
            ]);
          }
        }
      })();
    }
  }

  const callOnClick = () => {
    socket.emit("call", {
      username,
      id: myPeerId,
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
