import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function AddTask() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
                status: 'todo',
        dueDate: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

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
            const response = await fetch('http://localhost:3001/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                navigate('/home');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-task-container">
            <h1 className="page-title">Add New Task</h1>
            
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
                        {submitting ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTask;