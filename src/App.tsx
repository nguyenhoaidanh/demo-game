import "./App.css";
import { useEffect, useState } from "react";
import {
  ChainId,
  DevelopmentMode,
  GAME_IDS,
  PanGame,
  PanMessage,
  PanSdkEvent,
  ROBOT_CAT_GAME_FUNCTIONS,
} from "@digi-money/game";
import { validateResponse } from "./helper";

const panGameInstance = new PanGame({
  gameId: GAME_IDS.ROBOT_CAT,
  mode: DevelopmentMode.DEV, // remember update it to prod if you want to release
});

function App() {
  const [session, setSession] = useState<any | undefined>("");
  const [signature, setSignature] = useState("");
  const [signTxsResponse, setSignTxsResponse] = useState("");
  const [player, setPlayer] = useState("");

  useEffect(() => {
    const unsubscribe = panGameInstance.onMessage<PanMessage>((response) => {
      try {
        const { event, data, requestId } = response;
        console.log("game got data from wallet", response, requestId); // requestId: to mapping response to request which the game send to the wallet
        switch (event) {
          case PanSdkEvent.RES_CONNECT_WALLET:
            validateResponse(response);
            setSession(data);
            localStorage.setItem("connected", "1");
            break;

          case PanSdkEvent.RES_SIGN_MESSAGE:
            validateResponse(response);
            setSignature(data);
            break;

          case PanSdkEvent.RES_SIGN_TRANSACTION:
            validateResponse(response);
            setSignTxsResponse(data);
            break;

          case PanSdkEvent.RES_GET_DATA:
            validateResponse(response);
            setPlayer(JSON.stringify(data || {}));
            break;

          case PanSdkEvent.RES_UPDATE_DATA:
            validateResponse(response);
            setSignTxsResponse(data);
            break;
        }
      } catch (error) {
        alert(error);
      }
    });
    return () => unsubscribe();
  }, []);

  const reqConnectWallet = () => {
    const requestId = panGameInstance.connectWallet({
      chainId: ChainId.SOLANA,
      gameInfo: {
        name: "Game vo lam chi mong",
        logoUrl:
          "https://vuonglaogia.zagoo.vn/play-game/static/media/app_icon.bcf558d841cf81db6e85.png",
      },
    });
  };

  const reqDisconnectWallet = () => {
    const requestId = panGameInstance.disconnectWallet(null);
    setSession(undefined);
    localStorage.removeItem("connected");
  };

  const reqSignMessage = () => {
    const requestId = panGameInstance.signMessage({
      message: "Please sign this message: Hello world",
      chainId: ChainId.SOLANA,
    });
  };

  const triggerStartSession = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.startSession,
      payload: {},
    });
  };

  const triggerClaimGold = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.claimGold,
      payload: {},
    });
  };

  const triggerUpgrade = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.upgrade,
      payload: {},
    });
  };

  const triggerRepair = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.repair,
      payload: {},
    });
  };

  const triggerRefreshPlayer = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.refreshPlayer,
      payload: {},
    });
  };

  const triggerFetchPlayer = async () => {
    const requestId = panGameInstance.getData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.fetchPlayer,
      payload: {},
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

            <div>Sign Transaction data</div>
            {signTxsResponse && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(signTxsResponse)}
              </p>
            )}
            <hr style={{ width: "100%" }} />

            <button onClick={triggerStartSession}>
              Player: Start session{" "}
            </button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerClaimGold}>Player: Claim gold</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerRepair}>Player: Repair</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerUpgrade}>Player: upgrade</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerRefreshPlayer}>
              Player: refresh states
            </button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerFetchPlayer}>Player: fetch</button>
            {player && (
              <p style={{ wordBreak: "break-all" }}>{JSON.stringify(player)}</p>
            )}
            <hr style={{ width: "100%" }} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
