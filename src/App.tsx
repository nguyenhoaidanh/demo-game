import { useEffect, useRef, useState } from "react";
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
  const [estimateGas, setEstimateGas] = useState<any | undefined>("");

  const [walletBalance, setWalletBalance] = useState<any | undefined>("");

  const [signature, setSignature] = useState("");
  const [signTxsResponse, setSignTxsResponse] = useState("");
  const [player, setPlayer] = useState("");
  const [boxList, setBoxList] = useState([]);
  // const [boxRequest, setBoxRequest] = useState("");
  const boxRequestId = useRef("");

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
            if (requestId === boxRequestId.current) {
              setBoxList(data);
            } else {
              setPlayer(data);
            }
            break;

          case PanSdkEvent.RES_UPDATE_DATA:
            validateResponse(response);
            setSignTxsResponse(data);
            break;

          case PanSdkEvent.RES_GET_WALLET_BALANCE_INFO:
            validateResponse(response);
            setWalletBalance(data);
            break;

          case PanSdkEvent.RES_ESTIMATE_GAS_UPDATE_DATA:
            validateResponse(response);
            setEstimateGas(data);
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

  const reqGetWalletBalance = () => {
    const requestId = panGameInstance.getBalanceWalletInfo({
      chainId: ChainId.SOLANA,
    });
  };

  const reqSignMessage = () => {
    const requestId = panGameInstance.signMessage({
      message: "Please sign this message: Hello world",
      chainId: ChainId.SOLANA,
    });
  };
  //
  const triggerStartSession = async () => {
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.startSession,
      payload: {},
      options: { waitForTransactionCompleted: true },
    });
  };

  const triggerEstimateGasStartSession = async () => {
    const requestId = panGameInstance.estimateGasUpdateData({
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
      payload: {
        waitForTransactionCompleted: true, 
        heartNumber: 1,
      },
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

  const triggerFetchBoxList = () => {
    const requestId = panGameInstance.getData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.fetchBoxList,
      payload: {},
    });

    boxRequestId.current = requestId;
  };

  const triggerBuyBox = async () => {
    console.log(boxList[0].publicKey);
    const requestId = panGameInstance.updateData({
      chainId: ChainId.SOLANA,
      method: ROBOT_CAT_GAME_FUNCTIONS.buyBox,
      payload: {
        boxPublicKey: boxList[0].publicKey,
      },
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

            <button onClick={reqGetWalletBalance}>Get Wallet Balance</button>
            {walletBalance && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(walletBalance)}
              </p>
            )}

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

            <button onClick={triggerEstimateGasStartSession}>
              Player: Estimate Start session{" "}
            </button>
            {estimateGas && (
              <p style={{ wordBreak: "break-all" }}>
                {estimateGas?.estimateGas?.toString()}
              </p>
            )}
            <hr style={{ width: "100%" }} />

            <button onClick={triggerClaimGold}>Player: Claim gold</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerRepair}>Player: Repair</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerUpgrade}>Player: upgrade</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerFetchBoxList}>Player: fetch box list</button>
            {boxList && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(boxList)}
              </p>
            )}
            <hr style={{ width: "100%" }} />
            <button onClick={triggerBuyBox}>Player: buy box</button>
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
