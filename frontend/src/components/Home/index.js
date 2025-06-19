import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3001/tasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getStatusColor = (status) => {
        if (status === 'todo') return '#e3e3e3';
        if (status === 'in_progress') return '#ffd700';
        if (status === 'done') return '#90ee90';
        return '#ffffff';
    };

    const filteredTasks = filter === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === filter);

    if (loading) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="home-container">
            <h1 className="main-title">Task Manager</h1>
            
            <div className="header-section">
                <button 
                    className="add-btn"
                    onClick={() => navigate('/add')}
                >
                    Add New Task
                </button>
                
                <div className="filter-section">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
                        onClick={() => setFilter('todo')}
                    >
                        To Do
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
                        onClick={() => setFilter('in_progress')}
                    >
                        In Progress
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
                        onClick={() => setFilter('done')}
                    >
                        Done
                    </button>
                </div>
            </div>

            <div className="tasks-container">
                {filteredTasks.length === 0 ? (
                    <p className="no-tasks-msg">No tasks found</p>
                ) : (
                    filteredTasks.map(task => (
                        <div 
                            key={task.id} 
                            className="task-item"
                            style={{ borderLeft: `5px solid ${getStatusColor(task.status)}` }}
                        >
                            <div className="task-details">
                                <h3 className="task-title">{task.title}</h3>
                                {task.description && (
                                    <p className="task-desc">{task.description}</p>
                                )}
                                <div className="task-info">
                                    <span className="task-status">
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    {task.dueDate && (
                                        <span className="task-due">
                                            Due: {formatDate(task.dueDate)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="task-buttons">
                                <button 
                                    onClick={() => navigate(`/edit/${task.id}`)}
                                    className="edit-btn"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;