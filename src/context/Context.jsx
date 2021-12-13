import { createContext, useContext, useState } from 'react';

const PeerContext = createContext();

export const ContextProvider = ({ children }) => {

  const [isConnected, setIsConnected] = useState(false);

  return (
    <PeerContext.Provider value={{
      isConnected, setIsConnected
    }}>
      {children}
    </PeerContext.Provider>
  );
}

export const usePeer = () => {
  const data = useContext(PeerContext);
  return { ...data };
}