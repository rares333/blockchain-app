blockchain app to reduce boureaucracy

Quick Start
1) Clone

git clone https://github.com/rares333/blockchain-app.git
cd blockchain-app


2) Install dependencies

npm install
cd contracts && npm install
cd ../frontend && npm install


3) Start a local chain (Hardhat)

npx hardhat node
This launches an RPC at http://127.0.0.1:8545 with 20 funded accounts.

Keep this terminal open.

4) Deploy contracts & seed data
Open a new terminal in the project root:

npx hardhat run scripts/deploy.js --network localhost

PropertyNFT deployed to: 0xABCD...1234
Minted random cars/houses to demo accounts
Copy the deployed contract address.

5) Configure the frontend
Find src/contractUtils.js (or similar) and set:

export const CONTRACT_ADDRESS = "0xYourDeployedAddress";
export const NETWORK = {
  chainId: 31337,
  rpcUrl: "http://127.0.0.1:8545"
};

6) Connect MetaMask to Hardhat
In MetaMask → Networks → Add Network (manually):

Network Name: Hardhat (local)

RPC URL: http://127.0.0.1:8545

Chain ID: 31337

Currency Symbol: ETH

Import one of the private keys printed by npx hardhat node into MetaMask. (Use a burner account only!)

7) Run the React app

npm start
or
npm run dev

cd frontend
npm start
Open http://localhost:3000 and connect MetaMask.

Usage Guide
Inventory: See your Cars/Houses. Click an item to open a modal with all details (value, VIN/address, purchase date, token ID).

Transfer: Select one or more items, enter recipient address, enter price in USD; the UI shows the ETH equivalent live. Confirm in MetaMask.

Offers: Recipient sees incoming offers, with item image/icon and price shown in ETH and USD. They can Accept (asset transfers, ETH moves) or Refuse (if implemented).

Notifications: You’ll see success/error toasts for transactions and state changes.
