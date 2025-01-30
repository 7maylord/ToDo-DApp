import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abi from "./abi.json";
import "./App.css";


//Downgraded Solidity version to 0.8.19 that doesn't generate MCOPY
//const CONTRACT_ADDRESS = "0xEaaaa90bb4846984C6B9c7a3284004E6Cb718D22"; //pragma solidity ^0.8.20;
const CONTRACT_ADDRESS = "0x1E892ac089D41e5C28E2510E6884B266c47A090D"; //pragma solidity ^0.8.19; new address


function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    async function checkWalletConnection() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    }
    checkWalletConnection();
  }, []);

  // Function to shorten the wallet address (e.g., 0x1234...5678)
  function shortenAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  }

  // Request accounts function
  async function requestAccounts() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        toast.success("Wallet connected successfully!");
      } catch (err) {
        toast.error(`Wallet connection failed: ${err.message}`);
      }
    } else {
      toast.warn("Please add wallet to use this app.");
    }
  }

  function disconnectWallet() {
    setIsConnected(false);
    setWalletAddress("");
    setTasks([]);
    toast.success("Wallet Disconnected!");
  }

  async function addTask() {
    if (!taskTitle.trim() || !taskText.trim()) {
      toast.error("Task title and description cannot be empty!");
      return;
    }
    if (!isConnected) {
      toast.error("Wallet not connected!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.addTask(taskText, taskTitle, false);
      toast.info('Adding task...', { autoClose: false, toastId: 'addTask' });
      await tx.wait();
      toast.dismiss('addTask');
      await getTask();
      setTaskTitle("");
      setTaskText("");
      toast.success("Task Added Successfully");
    } catch (error) {
      toast.error("Error adding task:", error);
    }
  }

  async function deleteTask(taskId) {
    if (!isConnected) {
      toast.error("Wallet not connected!");
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      try {
        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        await getTask();
        toast.success("Task Deleted Successfully");
      } catch (error) {
        toast.error("Error deleting task:", error);
      }
    }
  }

  async function getTask() {
    if (!isConnected) {
      toast.error("Wallet not connected!");
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      try {
        const tasks = await contract.getMyTask();
        const newTasks = tasks.map((task) => ({
          id: Number(task.id),
          taskTitle: task.taskTitle,
          taskText: task.taskText,
          isDeleted: task.isDeleted,
        }));
        console.log(newTasks);
        setTasks(newTasks);
        toast.success("Tasks Updated!");
      } catch (error) {
        toast.error("Error fetching tasks:", error);
      }
    }
  }

  return (
    <div className="dapp-container">
      <h1>Task Manager</h1>
      {isConnected ? (
        <div>
          <p>
            <strong>Connected Wallet:</strong> {shortenAddress(walletAddress)}
          </p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={requestAccounts}>Connect Wallet</button>
      )}
      <div className="input-group">
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={addTask}>
          Add Task
        </button>
      </div>
      <h2>My Tasks ({tasks.length})</h2>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.taskTitle}</strong>: {task.taskText}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No tasks found</p>
        )}
      </ul>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;