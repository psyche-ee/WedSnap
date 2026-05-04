import { createContext, useContext, useState } from "react";

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  const [weddingId, setWeddingId] = useState(null);
  const [wedding, setWedding] = useState(null);

  const resetWedding = () => {
    setWeddingId(null);
    setWedding(null);
  };

  return (
    <WeddingContext.Provider
      value={{
        weddingId,
        setWeddingId,
        wedding,
        setWedding,
        resetWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);