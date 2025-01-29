import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const contractAddress = "0xeaaaa90bb4846984c6b9c7a3284004e6cb718d22";

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    async function loadBlockchainData() {
      await requestAccounts(); // Request wallet connection
      const contract = await getContract(); // Get the contract with provider
      setContract(contract);
      fetchTasks(contract); // Fetch tasks
    }
    loadBlockchainData();
  }, []);

  // Request wallet connection
  async function requestAccounts() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        toast.success("Wallet connected successfully!");
      } catch (err) {
        toast.error(`Wallet connection failed: ${err.message}`);
      }
    } else {
      toast.warn("Please add wallet to use this app.");
    }
  }

  // Get contract instance with or without signer
  async function getContract(signer = false) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return signer
        ? new ethers.Contract(contractAddress, abi, await provider.getSigner())
        : new ethers.Contract(contractAddress, abi, provider);
    } else {
      toast.error("Ethereum provider is not available.");
      return null;
    }
  }

  // Fetch tasks from the contract
  async function fetchTasks(contract) {
    if (contract) {
      try {
        const tasks = await contract.getMyTask();
        setTasks(tasks);
      } catch (err) {
        toast.error(`Failed to fetch tasks: ${err.message}`);
      }
    }
  }

  // Add a new task
  async function addTask() {
    if (contract && taskTitle && taskText) {
      try {
        const myContract = await getContract(true); // Get contract with signer
        const tx = await myContract.addTask(taskText, taskTitle, false);
        await tx.wait();
        fetchTasks(contract); // Refresh tasks
        setTaskTitle("");
        setTaskText("");
        toast.success("Task added successfully!");
      } catch (err) {
        toast.error(`Failed to add task: ${err.message}`);
      }
    } else {
      toast.warn("Please enter both task title and description.");
    }
  }

  // Delete a task
  async function deleteTask(taskId) {
    if (contract) {
      try {
        const myContract = await getContract(true); // Get contract with signer
        const tx = await myContract.deleteTask(taskId);
        await tx.wait();
        fetchTasks(contract); // Refresh tasks
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error(`Failed to delete task: ${err.message}`);
      }
    }
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="task-input">
        <label>Title</label>
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <label>Description</label>
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task description"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="task-card">
              <h2>{task.taskTitle}</h2>
              <p>{task.taskText}</p>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
