import "./App.css";
import { useEffect, useState } from "react";
import { ChainId, PanGame, PanSdkEvent } from "@digi-money/game";
import { validateResponse } from "./helper";
import {
  claimGold,
  createGalacticGameToken,
  initGame,
  startSession,
  startTheGame,
  upgrade,
  repair,
  fetchPlayer,
  fetchBalance,
} from "@digi-money/galactic-game-contract-sdk";
import buffer from "buffer";

window.Buffer = buffer.Buffer;
window.global ||= window;

const panGameInstance = new PanGame();

function App() {
  const [session, setSession] = useState<any | undefined>("");
  const [signature, setSignature] = useState("");
  const [signTxsResponse, setSignTxsResponse] = useState("");
  const [player, setPlayer] = useState("");
  const [balance, setBalance] = useState("");
  const rpcUrl = 'http://127.0.0.1:8899';

  window.Buffer = Buffer;
  useEffect(() => {
    const unsubscribe = panGameInstance.onMessage((response) => {
      try {
        const { event, data } = response;
        console.log("game got data from wallet", response);
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
    panGameInstance.disconnectWallet(null);
    setSession(undefined);
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

  const triggerCreateToken = async () => {
    const tx = await createGalacticGameToken(
      rpcUrl,
      session.wallet,
      "Gold token",
      "GOLD",
      "https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI"
    );

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerInitGame = async () => {
    const tx = await initGame(rpcUrl, session.wallet, {
      seasonDuration: 150,
      sessionDuration: 5,
      systemHealthCheckPeriod: 10,
      defaultBagCap: 5,
      defaultHearts: 3,
      goldEarnRates: Array.from({ length: 31 }, (_, i) => (i + 1) * 10),
      goldRepairCosts: Array.from({ length: 31 }, (_, i) => (i + 1) * 3),
      goldUpgradeCost: Array.from({ length: 30 }, (_, i) => i + 1),
      upgradeDurations: Array.from({ length: 30 }, (_, i) => (i + 1) * 5),
    });

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerStartGame = async () => {
    const tx = await startTheGame(rpcUrl, session.wallet);

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerStartSession = async () => {
    const tx = await startSession(rpcUrl, session.wallet);

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerClaimGold = async () => {
    const tx = await claimGold(rpcUrl, session.wallet);

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerUpgrade = async () => {
    const tx = await upgrade(rpcUrl, session.wallet);

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerRepair = async () => {
    const tx = await repair(rpcUrl, session.wallet);

    panGameInstance.sendTransaction({
      data: tx.serialize(),
      chainId: ChainId.SOLANA,
    });
  };

  const triggerFetchPlayer = async () => {
    const player = await fetchPlayer(rpcUrl, session.wallet);
    console.log(player);
    setPlayer(JSON.stringify(player));
  };

  const triggerFetchGoldBalance = async () => {
    const balance = await fetchBalance(
      rpcUrl,
      session.wallet
    );
    setBalance(JSON.stringify(balance));
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
            <hr style={{ width: "100%" }} />
            <button onClick={triggerCreateToken}>Owner: Create token</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerInitGame}>Owner: Init game</button>
            <hr style={{ width: "100%" }} />
            <button onClick={triggerStartGame}>Owner: Start game</button>
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
            <button onClick={triggerFetchPlayer}>Player: fetch</button>
            {player && (
              <p style={{ wordBreak: "break-all" }}>{JSON.stringify(player)}</p>
            )}
            <hr style={{ width: "100%" }} />
            <button onClick={triggerFetchGoldBalance}>
              Player: fetch balance
            </button>
            {balance && (
              <p style={{ wordBreak: "break-all" }}>
                {JSON.stringify(balance)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
