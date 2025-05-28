import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import '../css/to-do_style.css';
import React, { useEffect, useState } from "react";

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null); // State to track the task being edited
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  const getTodos = async () => {
    try {
      if (!user || !user.email) return;
      const response = await fetch(`http://localhost:3001/tasks/${user.email}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const jsonData = await response.json();
      setTodos(jsonData);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
  }, []);
  
  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [user]);
  

  const postTodos = async (e) => {
    e.preventDefault();
    try {
      if (!description.trim()) return alert("Task description cannot be empty!");
      const body = { userEmail: user.email, description, status: "pending" };
      const response = await fetch("http://localhost:3001/tasks", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setDescription("");   // Clear input
        setShowModal(false);  // Close modal
        getTodos();           // Refresh tasks
      } else {
        console.error("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  const deleteTodos = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        getTodos();  // Refresh the task list after deletion
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const toggleStatus = async (todo) => {
    try {
        const newStatus = todo.status === "completed" ? "pending" : "completed";
        const response = await fetch(`http://localhost:3001/tasks/${todo.id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            getTodos();
        } else {
            console.error("Failed to update status");
        }
    } catch (err) {
        console.error("Error updating status:", err.message);
    }
};

  const openEditModal = (todo) => {
    setEditTask(todo); // Set the task to be edited
    setDescription(todo.description); // Pre-fill the input with current task description
    setShowModal(true); // Show the modal
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    if (!description.trim()) return alert("Task description cannot be empty!");

    try {
        const response = await fetch(`http://localhost:3001/tasks/${editTask.id}/description`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description }),
        });

        if (response.ok) {
            setDescription(""); // Clear input
            setEditTask(null);
            setShowModal(false); // Close modal
            getTodos(); // Refresh task list
        } else {
            console.error("Failed to update task");
        }
    } catch (err) {
        console.error("Error updating task:", err.message);
    }
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="To-Do">
      <div className='head'>
        <img src='/profile-img.png' className="profile-img" alt="profile-img" />
        <div>
          {
            user && (
              <>
              <h4>{user.name}</h4>
              <h6>{user.email}</h6>
              </>
            )}
          
          <Button url="/" onClick={handleLogout} style={{ color: '#F4C27F' }}>Log Out</Button>
        </div>
      </div>
      
      <div className='to-do'>
        <h4>Tasks List</h4>
        <img 
          src='/plus-circle.png' 
          className="plus-img" 
          alt="Add Task" 
          onClick={() => setShowModal(true)} 
          style={{ cursor: "pointer" }}
        />

        <div className="task-container">
        {todos.map((todo) => (
          <div className="task-item" key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.status === 'completed'}
              onChange={() => toggleStatus(todo)}
            />
            <span
              className={todo.status === 'completed' ? "completed" : ""}
              onClick={() => openEditModal(todo)} // Open edit modal on click
            >
              {todo.description}
            </span>
            <button onClick={() => deleteTodos(todo.id)} className="delete-btn">Delete</button>
          </div>
        ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{editTask ? "Edit Task" : "Add New Task"}</h4>
            <form onSubmit={editTask ? updateTodo : postTodos}>
              <input
                type="text"
                className="input"
                placeholder="Task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">{editTask ? "Update" : "Add"}</button>
                <button type="button" className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDo;
