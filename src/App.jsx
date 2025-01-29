import { useState, useEffect, useCallback } from "react";
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

  // Initialize provider and contract on app load
  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

   // Fetch task
  async function fetchTasks() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const taskList = await contract.getMyTask();
        setTasks(taskList);
      } catch (error) {
        toast.error("Error fetching tasks:", error);
      }
    }
  }
  

  // Add a new task
  async function addTask() {
    if (!taskTitle || !taskText)
      return toast.error("Please enter task details");
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const myContract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await myContract.addTask(taskText, taskTitle, false);
        await tx.wait();
        toast.success("Task added successfully");
        setTaskTitle("");
        setTaskText("");
        fetchTasks();
      } catch (error) {
        toast.error("Error adding task:", error);
      }
    }
  }

  // Delete a task
  async function deleteTask(taskId) {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const theContract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await theContract.deleteTask(taskId);
        await tx.wait();
        toast.success("Task deleted successfully");
        fetchTasks();
      } catch (error) {
        toast.error("Error deleting task:", error);
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
