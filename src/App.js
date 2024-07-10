import "./App.css";
import { useEffect, useState } from "react";
import { ChainId, PanGame, PanSdkEvent } from "@digi-money/game";
import { validateResponse } from "./helper";
import { Buffer } from "buffer";

const panGameInstance = new PanGame();

function App() {
  const [session, setSession] = useState("");
  const [signature, setSignature] = useState("");
  const [signTxsResponse, setSignTxsResponse] = useState("");

  useEffect(() => {
    const unsubscribe = panGameInstance.onMessage((response) => {
      try {
        const { event, data } = response;
        console.log("game got data from wallet", response);
        switch (event) {
          case PanSdkEvent.RES_CONNECT_WALLET:
            validateResponse(response);
            setSession(data);
            localStorage.setItem("connected", 1);
            break;

          case PanSdkEvent.RES_SIGN_MESSAGE:
            validateResponse(response);
            setSignature(data);
            break;

          case PanSdkEvent.RES_SIGN_TRANSACTION:
            validateResponse(response);
            setSignTxsResponse(data);
            break;

          default:
            break;
        }
      } catch (error) {
        alert(error);
      }
    });
    return () => unsubscribe();
  }, []);

  const reqConnectWallet = () => {
    panGameInstance.connectWallet({
      chainId: ChainId.SOLANA,
      gameInfo: {
        name: "Game vo lam chi mong",
        logoUrl:
          "https://vuonglaogia.zagoo.vn/play-game/static/media/app_icon.bcf558d841cf81db6e85.png",
      },
    });
  };

  const reqDisconnectWallet = () => {
    panGameInstance.disconnectWallet();
    setSession();
    localStorage.removeItem("connected");
  };

  const reqSignMessage = () => {
    panGameInstance.signMessage({
      message: "Please sign this message: Hello world",
      chainId: ChainId.SOLANA,
    });
  };

  const reqSignTransaction = () => {
    panGameInstance.sendTransaction({
      data: Buffer.from("Hello, Solana!", "base64"), // or VersionTransaction here
      chainId: ChainId.SOLANA,
    });
  };

  useEffect(() => {
    // the first time visit app, request connect
    if (localStorage.getItem("connected")) reqConnectWallet();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        {!session ? (
          <button onClick={reqConnectWallet}>connect</button>
        ) : (
          <>
            <button onClick={reqDisconnectWallet}>disconnect</button>
            <p style={{ wordBreak: "break-all" }}>{JSON.stringify(session)}</p>

            <hr style={{ width: "100%" }} />

            <button onClick={reqSignMessage}>Sign message</button>
            {signature && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(signature)}
              </p>
            )}

            <hr style={{ width: "100%" }} />

            <button onClick={reqSignTransaction}>Sign Transaction</button>
            {signTxsResponse && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(signTxsResponse)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
