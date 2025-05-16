import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaRegCalendarAlt,
  FaClock,
  FaMoon,
  FaSun,
  FaUserTimes
} from "react-icons/fa";

function List() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newTasks, setNewTasks] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark", newMode);
  };

  function addList() {
    if (newListName.trim() === "") return;
    const newList = { name: newListName.trim(), tasks: [] };
    setLists([...lists, newList]);
    setNewListName("");
  }

  function deleteList(name) {
    const updatedLists = lists.filter((list) => list.name !== name);
    setLists(updatedLists);
  }

  function addTask(name) {
    const taskData = newTasks[name];
    if (!taskData?.text || taskData.text.trim() === "") return;

    const newTask = {
      text: taskData.text.trim(),
      date: taskData.date || "",
      time: taskData.time || ""
    };

    const updatedLists = lists.map(list =>
      list.name === name
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );

    setLists(updatedLists);
    setNewTasks({ ...newTasks, [name]: {} });
  }

  function deleteTask(listName, index) {
    const updatedLists = lists.map(list =>
      list.name === listName
        ? { ...list, tasks: list.tasks.filter((_, i) => i !== index) }
        : list
    );
    setLists(updatedLists);
  }

  function moveTask(listName, index, direction) {
    const updatedLists = lists.map(list => {
      if (list.name !== listName) return list;

      const tasks = [...list.tasks];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= tasks.length) return list;

      [tasks[index], tasks[newIndex]] = [tasks[newIndex], tasks[index]];
      return { ...list, tasks };
    });

    setLists(updatedLists);
  }

  return (
    <div className="app-container">
      <button className="toggle-mode" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Multi-User To-Do List with Calendar 🗓️</h1>

      <div className="new-list">
        <input
          type="text"
          placeholder="Add a new user..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={addList}><FaPlus /> Add User</button>
      </div>

      <div className="lists">
        {lists.map((list) => (
          <div key={list.name} className="list-card">
            <div className="list-header">
              <h2>{list.name}'s List</h2>
              <button className="delete-user" onClick={() => deleteList(list.name)}><FaUserTimes /></button>
            </div>
            <div className="task-input">
              <input
                type="text"
                placeholder="Enter a task"
                value={newTasks[list.name]?.text || ""}
                onChange={(e) =>
                  setNewTasks({
                    ...newTasks,
                    [list.name]: {
                      ...(newTasks[list.name] || {}),
                      text: e.target.value
                    }
                  })
                }
              />
              <input
                type="date"
                value={newTasks[list.name]?.date || ""}
                onChange={(e) =>
                  setNewTasks({
                    ...newTasks,
                    [list.name]: {
                      ...(newTasks[list.name] || {}),
                      date: e.target.value
                    }
                  })
                }
              />
              <input
                type="time"
                value={newTasks[list.name]?.time || ""}
                onChange={(e) =>
                  setNewTasks({
                    ...newTasks,
                    [list.name]: {
                      ...(newTasks[list.name] || {}),
                      time: e.target.value
                    }
                  })
                }
              />
              <button onClick={() => addTask(list.name)}><FaPlus /></button>
            </div>
            <ol>
              {list.tasks.map((task, index) => (
                <li key={index} className="task-item">
                  <div className="task-details">
                    <span>{task.text}</span>
                    <small><FaRegCalendarAlt /> {task.date} <FaClock /> {task.time}</small>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => deleteTask(list.name, index)}><FaTrash /></button>
                    <button onClick={() => moveTask(list.name, index, "up")}><FaArrowUp /></button>
                    <button onClick={() => moveTask(list.name, index, "down")}><FaArrowDown /></button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
