import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import "./index.css";
import { Bounce, ToastContainer, toast } from "react-toastify";

const contractAddress = "0x74D3ABD84772869404fc8aEbA9F2803EBB0101D6";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function addTask() {
    if (!taskTitle || !taskText)
      return toast.error("Please enter task details");
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.addTask(taskText, taskTitle, false);
        await tx.wait();
        toast.success("Task added successfully");
        getMyTasks();
      } catch (error) {
        toast.error("Error adding task:", error);
      }
    }
  }

  async function getMyTasks() {
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

  async function deleteTask(taskId) {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        toast.success("Task deleted successfully");
        getMyTasks();
      } catch (error) {
        toast.error("Error deleting task:", error);
      }
    }
  }

  useEffect(() => {
    getMyTasks();
  }, []);

  return (
    <div>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <div className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex justify-between py-5 px-8">
          <h4 className="font-extrabold text-white">DAPP</h4>
          {/* <h1 className="font-extrabold text-white">
            Smart Contract Interaction
          </h1> */}
          <h2 className="text-white">@Web3Bridge</h2>
        </div>
        <div className="flex items-center justify-center mt-28">
          <div className="px-[30%]">
            <h1 className="text-4xl font-bold mb-10">Ebuka Task Manager</h1>
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="border-[2px] rounded-md px-2 py-1 w-full border-green-800 outline-none mb-2"
              />
              <textarea
                name=""
                className="border-[2px] rounded-md px-2 py-1 w-full h-[20vh] border-green-800 resize-none outline-none mb-4"
                placeholder="Task Description"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              ></textarea>
              {/* <input type="text" /> */}
              <button
                onClick={addTask}
                className="bg-green-800 py-2 w-full rounded-md text-white font-bold"
              >
                Add Task
              </button>
            </div>
            <h2>My Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.taskTitle}</strong>: {task.taskText}
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

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