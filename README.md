## Old contract Address: "0xEaaaa90bb4846984C6B9c7a3284004E6Cb718D22"; //pragma solidity ^0.8.20;
## New contract Address: "0x1E892ac089D41e5C28E2510E6884B266c47A090D"; //pragma solidity ^0.8.19;
## DO NOT SEND TOKENS TO THIS ADDRESS 
## THIS IS A SIMULATED TESTNET CONTRACT, FUNDS SENT CANNOT BE WITHDRAWN


# To-Do DApp

A decentralized To-Do application built on Ethereum using React, Vite, and Ethers.js. This DApp allows users to manage their tasks on the blockchain with functionalities such as adding, deleting, and retrieving tasks.

## Features

- **Decentralized Task Management**: Store tasks securely on the Ethereum blockchain.
- **Wallet Integration**: Connect and interact with smart contracts via wallets(Metamask)
- **Live Blockchain Updates**: Fetch tasks dynamically from the blockchain.
- **Real-Time Notifications**: Get instant feedback with toast notifications.

## Requirements

To run this project, ensure you have the following installed:

- **Node.js** (v16 or later recommended)
- **MetaMask Extension** (for interacting with the blockchain) or Any Wallet extension
- **Core Testnet (tCORE)** (for smart contract deployment),[ Click here to get faucet for testnet](https://scan.test.btcs.network/faucet)
- **Vite** (for fast frontend development)
- **Ethers.js** (for interacting with Ethereum blockchain)

## Installation

Follow these steps to set up the project:

1. **Clone the repository**
   ```sh
   git clone https://github.com/7maylord/ToDo-DApp.git
   cd ToDo-DApp
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the development server**
   ```sh
   npm run dev
   ```
4. **Open in browser**
   - Visit `http://localhost:5173/` to access the application.

## Usage

1. **Connect Wallet**: Click on the "Connect Wallet" button to connect MetaMask.
2. **Fetch Tasks**: The app automatically fetches tasks from the blockchain.
3. **Add Task**: Enter a task title and description, then click "Add Task" to store it on the blockchain.
4. **Delete Task**: Click the "Delete" button next to a task to remove it from the blockchain.

## Smart Contract

The smart contract for this DApp is deployed on the **Core Testnet**. Ensure that your MetaMask is connected to the same network to interact with the contract.

### Contract Address

```
0x1E892ac089D41e5C28E2510E6884B266c47A090D
```

## Tech Stack

- **Frontend**: React + Vite
- **Blockchain**: CORE (tCORE Testnet)
- **Smart Contract**: Solidity
- **Library**: Ethers.js
- **UI Notifications**: React-Toastify


## License

This project is licensed under the MIT License.

## Author
Developed by **[MayLord](https://github.com/7maylord)**. Feel free to contribute and improve the project!

---

Happy coding! 🚀

