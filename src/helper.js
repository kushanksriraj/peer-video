export const API_KEY = process.env.REACT_APP_API_KEY;
export const YANDEX_TRANSLATE_URL = process.env.REACT_APP_YANDEX_TRANSLATE_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
export const PEER_SERVER_URL = process.env.REACT_APP_PEER_SERVER_URL;
export const PEER_SERVER_PORT = Number.parseInt(
  process.env.REACT_APP_PEER_SERVER_PORT
);
export const PEER_SERVER_PATH = process.env.REACT_APP_PEER_SERVER_PATH;
export const STUN_URL = process.env.REACT_APP_STUN_URL;
export const TURN_URL = process.env.REACT_APP_TURN_URL;
export const TURN_USERNAME = process.env.REACT_APP_TURN_USERNAME;
export const TURN_CREDENTIAL = process.env.REACT_APP_TURN_CREDENTIAL;

export const DATA_TYPE = {
  MESSAGE: "MESSAGE",
  TYPING_STARTED: "TYPING_STARTED",
  TYPING_STOPPED: "TYPING_STOPPED",
  MIRROR_ON: "MIRROR_ON",
  MIRROR_OFF: "MIRROR_OFF",
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
