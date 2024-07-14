# Demo Game

- Make sure this app open in game via iframe

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Game supported functions

We have a SDK that support interaction with the contract.

Install dependency:

```bash
"@digi-money/galactic-game-contract-sdk": "0.0.1-rc39"
```

After connect wallet, you will receive a session with these data. We can use them as parameters for our game SDK.

```js
{
  'rpcUrl': '',
  'wallet': ''
}
```

### Create token

Create token for the game

```js
const tx = await createGameToken(
  session.rpcUrl,
  session.wallet,
  "Gold token",
  "GOLD",
  "https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI"
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### Init game

Initialize the game, with some configurations.

```js
const tx = await initGame(
  session.rpcUrl,
  session.wallet,
  {
    seasonDuration: 150,
    sessionDuration: 5,
    systemHealthCheckPeriod: 10,
    defaultBagCap: 5,
    defaultHearts: 3,
    goldEarnRates: Array.from({ length: 31 }, (_, i) => (i + 1) * 10),
    goldRepairCosts: Array.from({ length: 31 }, (_, i) => (i + 1) * 3),
    goldUpgradeCost: Array.from({ length: 30 }, (_, i) => i + 1),
    upgradeDurations: Array.from({ length: 30 }, (_, i) => (i + 1) * 5),
  }
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### Start the game

Start the game with a new season

```js
const tx = await startTheGame(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### [Player] Start a new session

```js
const tx = await startSession(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### [Player] Claim gold

```js
const tx = await claimGold(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### [Player] Upgrade

```js
const tx = await upgrade(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### [Player] Repair

```js
const tx = await repair(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```

### [Player] fetch data

```js
const player = await fetchPlayer(
  session.rpcUrl, 
  session.wallet
);
console.log(player);
```

### [Player] Fetch player balance

```js
const balance = await fetchBalance(
  session.rpcUrl, 
  session.wallet
);
setBalance(JSON.stringify(balance));
```

### [Player] Refresh player 

This function should be called whenever user reopen the game since it recalculate all the latest data of the player. 

```js
const tx = await refreshPlayer(
  session.rpcUrl, 
  session.wallet
);

panGameInstance.sendTransaction({
  data: tx.serialize(),
  chainId: ChainId.SOLANA,
});
```