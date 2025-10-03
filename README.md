# Employee Management System

A complete, production-quality CRUD application to manage employees. Built with **Node.js + Express** for the backend, **SQLite** for persistence, and **React** for the frontend.

## Features

- ✅ Create, Read, Update, Delete (CRUD) operations for employees
- ✅ Search employees by name (case-insensitive)
- ✅ Form validation (client-side and server-side)
- ✅ Responsive UI with TailwindCSS
- ✅ RESTful API with proper error handling
- ✅ Comprehensive test coverage
- ✅ Modern React with Hooks and Context API
- ✅ SQLite database with migrations

## Tech Stack

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- Express Validator
- Jest + Supertest for testing

### Frontend
- React 18
- Vite
- TailwindCSS
- Context API for state management
- Vitest + React Testing Library

## Project Structure

```
project/
├── server/                 # Backend application
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js
│   │   │   └── migrations/
│   │   │       └── 001_create_employees.sql
│   │   ├── models/
│   │   │   └── employee.model.js
│   │   ├── controllers/
│   │   │   └── employee.controller.js
│   │   ├── routes/
│   │   │   └── employees.routes.js
│   │   ├── middleware/
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   └── employees.test.js
│   └── package.json
├── client/                 # Frontend application
│   ├── src/
│   │   ├── api/
│   │   │   └── employees.js
│   │   ├── components/
│   │   │   ├── EmployeeTable.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Spinner.jsx
│   │   ├── pages/
│   │   │   └── EmployeeListPage.jsx
│   │   ├── context/
│   │   │   └── EmployeesContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tests/
│   │   └── EmployeeList.test.jsx
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project folder)

```bash
cd project
```

2. **Install backend dependencies**

```bash
cd server
npm install
```

3. **Install frontend dependencies**

```bash
cd ../client
npm install
```

### Running the Application

#### Backend

```bash
cd server
npm run dev
```

The server will start on `http://localhost:4000`

#### Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

### Running Tests

#### Backend Tests

```bash
cd server
npm test
```

#### Frontend Tests

```bash
cd client
npm test
```

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### 1. Get All Employees
```http
GET /api/employees
```

**Query Parameters:**
- `name` (optional) - Filter by name (case-insensitive substring match)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "position": "Engineer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 100,
  "total": 1
}
```

#### 2. Get Employee by ID
```http
GET /api/employees/:id
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "position": "Engineer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "position": "Manager"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "position": "Manager",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### 4. Update Employee
```http
PUT /api/employees/:id
Content-Type: application/json

{
  "position": "Senior Manager"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "position": "Senior Manager",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T10:30:00.000Z"
  }
}
```

#### 5. Delete Employee
```http
DELETE /api/employees/:id
```

**Response:** `204 No Content`

### Error Responses

#### Validation Error (400)
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "error": "Employee not found"
}
```

#### Conflict (409)
```json
{
  "error": "Email already exists"
}
```

#### Server Error (500)
```json
{
  "error": "Internal Server Error"
}
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) <= 100),
  email TEXT NOT NULL UNIQUE CHECK(length(email) <= 255),
  position TEXT NOT NULL CHECK(length(position) <= 50),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Environment Variables

### Backend

Create a `.env` file in the `server` directory (optional):

```env
PORT=4000
DB_PATH=./src/db/database.sqlite
```

### Frontend

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:4000/api
```

## Development

### Backend Development

```bash
cd server
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development

```bash
cd client
npm run dev  # Runs with Vite HMR
```

### Linting

```bash
# Backend
cd server
npm run lint

# Frontend
cd client
npm run lint
```

### Code Formatting

```bash
# Backend
cd server
npm run format

# Frontend
cd client
npm run format
```

## Testing

### Backend Tests

The backend includes comprehensive tests covering:
- Employee creation (success and validation errors)
- Duplicate email handling
- Employee retrieval (list and by ID)
- Employee updates
- Employee deletion
- Search functionality

Run tests:
```bash
cd server
npm test
```

### Frontend Tests

The frontend includes tests for:
- Rendering employee list
- Adding new employees
- Editing employees
- Deleting employees
- Search functionality

Run tests:
```bash
cd client
npm test
```

## Production Build

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run build
npm run preview
```

## Troubleshooting

### Port Already in Use

If port 4000 or 3000 is already in use:

**Backend:**
```bash
PORT=5000 npm run dev
```

**Frontend:**
Update `vite.config.js` to use a different port.

### Database Issues

If you encounter database issues, delete the database file and restart:

```bash
rm server/src/db/database.sqlite
cd server
npm run dev
```

### CORS Issues

If you encounter CORS issues, ensure the backend is running and the frontend proxy is configured correctly in `vite.config.js`.


