# Task Manager Application

## Project Overview

Task Manager is a full-stack web application that allows users to manage their tasks efficiently. This application provides a simple and intuitive interface for creating, viewing, updating, and deleting tasks. Users can organize tasks by status (To Do, In Progress, Done) and set due dates for better task management.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **sqlite3** - SQLite driver for Node.js
- **CORS** - Cross-Origin Resource Sharing middleware

### Frontend
- **React** - JavaScript library for building user interfaces
- **React Router** - Routing library for React applications
- **CSS3** - Styling with custom CSS modules
- **Fetch API** - For making HTTP requests


## 🚀 Installation & Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js

The backend server will run on http://localhost:3001

```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the server
npm server

The frontend server will run on http://localhost:3000
```

## API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint       | Description                  |
|--------|----------------|------------------------------|
| GET    | `/tasks`       | Retrieve all tasks           |
| GET    | `/tasks/:id`   | Retrieve a specific task by ID |
| POST   | `/tasks`       | Create a new task            |
| PUT    | `/tasks/:id`   | Update an existing task      |
| DELETE | `/tasks/:id`   | Delete a task                |

## Request/Response Examples

### POST `/tasks`

**Request Body:**

```json
{
  "title": "Complete project",
  "description": "Finish the task manager application",
  "status": "in_progress",
  "dueDate": "2024-12-31"
}
```

### PUT `/tasks/:id`
All fields are optional. Only send the fields you want to update.

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "done",
  "dueDate": "2024-12-25"
}

```

# Frontend Pages

## Home Page (`/` or `/home`)
**Purpose:** Main dashboard displaying all tasks

### Features:
- List view of all tasks with their details
- Filter tasks by status (All, To Do, In Progress, Done)
- Quick actions to edit or delete tasks
- Navigation button to add new tasks
- Color-coded task cards based on status

---

## Add Task Page (`/add`)
**Purpose:** Create new tasks

### Features:
- Form with fields for title, description, status, and due date
- Client-side validation for required fields
- Cancel button to return to home page
- Success redirect to home page after task creation

---

## Edit Task Page (`/edit/:id`)
**Purpose:** Update existing tasks

### Features:
- Pre-populated form with current task details
- Same fields as Add Task page
- Client-side validation
- Cancel button to return without saving
- Success redirect to home page after update

---

# Optional Features Implemented

## 1. Responsive Design
- Mobile-friendly layout that adapts to different screen sizes
- Responsive navigation and form layouts
- Touch-friendly buttons and controls

## 2. Form Validation
- Client-side validation for required fields (title and status)
- Error messages displayed below invalid fields
- Real-time error clearing when user corrects input
- Disabled submit button during form submission

## 3. Task Filtering
- Filter tasks by status on the home page
- Active filter state indication
- Maintains filter selection during task operations
- Shows appropriate message when no tasks match filter

## 4. Visual Enhancements
- Color-coded task cards based on status
- Hover effects on interactive elements
- Loading states during data fetching
- Smooth transitions and animations

## 5. User Experience Features
- Confirmation dialog before deleting tasks
- Loading indicators during API calls
- Error handling with user-friendly messages

---

# Database Schema

## Tasks Table

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) NOT NULL,
    dueDate TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```
