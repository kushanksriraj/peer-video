export const API_KEY =
  "trnsl.1.1.20211212T161217Z.0831f8bca96760d5.2c7f958d368ca87a6c7382819e8a13461ccdde94";

export const YANDEX_TRANSLATE_URL =
  "https://translate.yandex.net/api/v1.5/tr.json/translate";

export const DB_API = "https://peer-db.kushanksriraj.repl.co/";

export const SOCKET_URL = "https://peer-socket-1.kushanksriraj.repl.co";

export const PEER_SERVER_URL = "peer-server.kushanksriraj.repl.co";
export const PEER_SERVER_PORT = 8080;
export const PEER_SERVER_PATH = "/signaling";

export const STUN_URL = "stun:numb.viagenie.ca:3478";
export const TURN_URL = "turn:numb.viagenie.ca:3478";

export const TURN_USERNAME = "shreeraj157@gmail.com";
export const TURN_CREDENTIAL = "Qwerty@123";

export const DATA_TYPE = {
  MESSAGE: "MESSAGE",
  TYPING_STARTED: "TYPING_STARTED",
  TYPING_STOPPED: "TYPING_STOPPED",
  MIRROR_ON: "MIRROR_ON",
  MIRROR_OFF: "MIRROR_OFF"
};

export const decode = (str) => {
  return decodeURIComponent(escape(window.atob(str)));
};

export const encode = (str) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

export const replaceStream = (peerConnection, mediaStream) => {
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

export const getTranslationURL = (text) => {
  return `${YANDEX_TRANSLATE_URL}?key=${API_KEY}&text=${text}&lang=en-ru`;
};
