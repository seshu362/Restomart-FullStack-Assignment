import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

function EditTask() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        dueDate: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`);
            if (response.ok) {
                const task = await response.json();
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    status: task.status || 'todo',
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
                });
            } else {
                alert('Task not found');
                navigate('/home');
            }
        } catch (error) {
            console.error('Error fetching task:', error);
            alert('Failed to fetch task details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setSubmitting(true);
        
        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                navigate('/home');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading task details...</div>;
    }

    return (
        <div className="edit-task-container">
            <h1 className="page-title">Edit Task</h1>
            
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={errors.title ? 'error' : ''}
                        placeholder="Enter task title"
                    />
                    {errors.title && <span className="error-msg">{errors.title}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter task description (optional)"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={errors.status ? 'error' : ''}
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    {errors.status && <span className="error-msg">{errors.status}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/home')}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditTask;