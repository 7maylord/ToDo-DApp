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
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
          fetchTasks(contract);
          toast.success("Wallet connected successfully!");
        } catch (err) {
          toast.error(`Error connecting wallet: ${err.message}`);
        }
      } else {
        toast.warn("Please install MetaMask to use this app.");
      }
    }
    loadBlockchainData();
  }, []);

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

  async function addTask() {
    if (contract && taskTitle && taskText) {
      try {
        const tx = await contract.addTask(taskText, taskTitle, false);
        await tx.wait();
        fetchTasks(contract);
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

  async function deleteTask(taskId) {
    if (contract) {
      try {
        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        fetchTasks(contract);
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
