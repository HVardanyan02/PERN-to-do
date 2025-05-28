const express = require('express');
const bcrypt = require('bcrypt');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


const pool = require('./db');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get("/tasks/:email", async (req, res) => {
    const { email } = req.params;
  
    try {
      const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userId = userResult.rows[0].id;
  
      // Fetch tasks for this user
      const tasksResult = await pool.query(`
        SELECT t.id, t.description, t.status
        FROM tasks t
        JOIN user_tasks ut ON t.id = ut.task_id
        WHERE ut.user_id = $1
      `, [userId]);
  
      res.json(tasksResult.rows);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

app.post("/tasks", async (req, res) => {
    const { userEmail, description, status } = req.body;
  
    try {
      // Get user id from email
      const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [userEmail]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userId = userResult.rows[0].id;
  
      // Insert task into tasks table
      const taskResult = await pool.query(
        "INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING id",
        [description, "pending"]
      );
      const taskId = taskResult.rows[0].id;
  
      // Link task to user in user_tasks
      await pool.query(
        "INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)",
        [userId, taskId]
      );
  
      res.status(201).json({ message: "Task created successfully!" });
    } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ error: "Server error while creating task" });
    }
  });
  

//put to-do's description
app.put("/tasks/:id/description", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updatedTask = await pool.query(
            "UPDATE tasks SET description = $1 WHERE id = $2 RETURNING *",
            [description, id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

//put to-do's status
app.put("/tasks/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTask = await pool.query(
            "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

//delete to-do's
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the task exists
        const check = await pool.query(
            "SELECT EXISTS (SELECT 1 FROM tasks WHERE id = $1)",
            [id]
        );

        if (!check.rows[0].exists) {
            return res.status(404).json({ error: "The task is not available" });
        }

        // Delete the task
        const deletedTask = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        res.status(200).json({
            message: `The task "${deletedTask.rows[0].description}" has been deleted successfully!`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});

//user registration
app.post('/registration', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query(
        "SELECT name, email, password FROM users WHERE email = $1",
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password!" });
      }
  
      const user = result.rows[0];
  
      // Compare provided password with the hashed password stored in DB
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password!" });
      }
  
      res.json({ name: user.name, email: user.email });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
