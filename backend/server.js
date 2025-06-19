const express = require('express');
const { open } = require('sqlite');
const path = require('path');
const sqlite3 = require('sqlite3');
const cors = require('cors');

let db;
const app = express();
app.use(express.json());
app.use(cors());

// Initialize database and start server
const initializeDBandServer = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database,
        });
        
        // Create tasks table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) NOT NULL,
                dueDate TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        app.listen(3001, () => {
            console.log('Server is running on http://localhost:3001/');
        });
    } catch (error) {
        console.log(`Database error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBandServer();

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks ORDER BY createdAt DESC');
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /tasks - Create new task
app.post('/tasks', async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    
    // Basic validation
    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }
    
    if (!['todo', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    
    try {
        const result = await db.run(
            `INSERT INTO tasks (title, description, status, dueDate) 
             VALUES (?, ?, ?, ?)`,
            [title, description || null, status, dueDate || null]
        );
        
        const newTask = await db.get(
            'SELECT * FROM tasks WHERE id = ?',
            [result.lastID]
        );
        
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// GET /tasks/:id - Get single task
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error.message);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    
    // Validation
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    
    try {
        // Check if task exists
        const existingTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // Update task
        await db.run(
            `UPDATE tasks 
             SET title = COALESCE(?, title),
                 description = COALESCE(?, description),
                 status = COALESCE(?, status),
                 dueDate = COALESCE(?, dueDate),
                 updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [title, description, status, dueDate, id]
        );
        
        const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});