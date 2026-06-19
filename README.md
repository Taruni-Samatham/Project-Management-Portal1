# TaskSphere - Project Management Portal

A production-ready, feature-rich Project Management Portal designed to organize task workflows, display project metrics, and streamline task allocation. 

Built with React (Ant Design) on the frontend and Node.js (Express + Mongoose) on the backend.

## Tech Stack
- **Frontend**: React.js (built with Vite), React Router Dom, Axios, Ant Design, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT Authentication (jsonwebtoken, bcryptjs), MongoDB, Mongoose.
- **Testing**: Jest, Supertest, MongoDB Memory Server.

---

## Project Structure

```
project-management-portal/
├── backend/
│   ├── config/
│   │   └── db.js            # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Handles signup, login, profile me endpoints
│   │   └── taskController.js # Handles tasks CRUD, searching, filters, stats
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification and user context injection
│   ├── models/
│   │   ├── Task.js           # Task schema (title, description, status, user ref)
│   │   └── User.js           # User schema (email, name, password hash)
│   ├── routes/
│   │   ├── authRoutes.js     # User registration and session endpoints
│   │   └── taskRoutes.js     # Protected task CRUD & stats endpoints
│   ├── tests/
│   │   ├── auth.test.js      # Register & login integration tests
│   │   └── task.test.js      # CRUD, search, filter & stats tests
│   ├── .env                  # Environment configuration
│   ├── package.json          # Node scripts and server dependencies
│   └── server.js             # Express application initialization
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Glassmorphic top navigation bar
│   │   │   └── TaskStats.jsx # Status KPI cards (Total, Pending, etc.)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Task tables, search, sort, pagination, modals
│   │   │   ├── Login.jsx     # Log-in form validation and submissions
│   │   │   ├── Register.jsx  # Sign-up validation and confirmation checks
│   │   │   └── TaskFormPage.jsx # Multi-mode page (Create and Update)
│   │   ├── services/
│   │   │   ├── api.js         # Base Axios client with request & response interceptors
│   │   │   ├── authService.js # Handles login/logout sessions and caching
│   │   │   └── taskService.js # Connects task routes (create, read, update, delete)
│   │   ├── App.css           # Styling overrides
│   │   ├── App.jsx           # Routing paths & custom AntD Theme Provider
│   │   ├── index.css         # Styling system & dark login gradients
│   │   └── main.jsx          # React app DOM mount point
│   ├── index.html            # Main markup with SEO meta details
│   ├── package.json          # Dev tooling & frontend dependencies
│   └── vite.config.js        # Vite configurations and local dev proxy
└── README.md
```

---

## Features
- **Dashboard**: Professional view containing task lists inside styled tables, displaying status badges, and action triggers.
- **Task Lifecycle (CRUD)**: Create, Read, Edit, and Delete tasks. Includes confirmation modal triggers prior to removal.
- **Search & Filtering**: Real-time searching by title with status filters (Pending, In Progress, Completed).
- **Sorting**: Toggle order by date created (newest/oldest) and title alphabetical ranges.
- **Dashboard KPI Metrics**: Interactive indicator panels summarizing Total, Pending, In Progress, and Completed task states.
- **JWT Security & Isolation**: Fully isolated task sets scoped strictly to the authenticated user.
- **Pagination**: Server-side pagination controls (adjustable sizing e.g., 5, 10, 20 items per page).
- **Graceful Loading & Feedback**: UI Spinners, skeleton loading boxes, and toast message warnings for all action outcomes.

---

## API Documentation

### Auth Routes (`/api/auth`)
- `POST /register`: Registers a new user. Returns user details and Bearer token.
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- `POST /login`: Log in to an account. Returns Bearer token.
  - Body: `{ "email": "john@example.com", "password": "password123" }`
- `GET /me` (Private): Gets profile details of the currently authenticated session.

### Task Routes (`/api/tasks`)
All task routes are private and require a `Bearer <token>` in the `Authorization` header.
- `GET /`: Get all tasks of the logged-in user.
  - Query parameters: `search` (string), `status` (Pending/In Progress/Completed), `sortBy` (e.g. `createdAt:desc`, `title:asc`), `page` (number), `limit` (number).
- `GET /stats`: Computes task statistics (Total, Pending, In Progress, Completed) for the user.
- `GET /:id`: Retrieves details of a specific task.
- `POST /`: Creates a new task.
  - Body: `{ "title": "Implement auth", "description": "Add JWT", "status": "Pending" }`
- `PUT /:id`: Updates fields of a specific task.
  - Body: `{ "title": "Updated title", "status": "In Progress" }`
- `DELETE /:id`: Deletes a specific task.

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Running instance locally or an Atlas connection URI)

### Backend Setup
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create/verify `.env` configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/project_management
   JWT_SECRET=super_secret_project_management_portal_key_12345
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server (development mode):
   ```bash
   npm run dev
   ```
5. Run unit/integration tests:
   ```bash
   npm test
   ```

### Frontend Setup
1. Open a terminal in the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the React client:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## Assumptions
- Each user registers/logs in and is only able to see, edit, or delete their own tasks.
- If a task is created without a status, it defaults to `Pending`.
- A local MongoDB instance is running on port `27017` by default. If using another port or Atlas, change `MONGO_URI` in `backend/.env`.

---

## Screenshots*
- **Workspace Dashboard**: Displays the statistical panels, filters, task table, and action triggers.
- <img width="1899" height="901" alt="Screenshot 2026-06-20 000426" src="https://github.com/user-attachments/assets/b8450706-a6b7-4da2-ba54-ff2673003deb" />
  <img width="1900" height="890" alt="Screenshot 2026-06-20 000542" src="https://github.com/user-attachments/assets/d990590f-6efd-4e87-8483-550d6e65deb3" />

- **Login / Signup Screens**: 
- <img width="1130" height="779" alt="Screenshot 2026-06-20 000503" src="https://github.com/user-attachments/assets/d717fbb6-9728-4542-a8e5-ef061293b5b3" />
  <img width="773" height="756" alt="Screenshot 2026-06-20 000517" src="https://github.com/user-attachments/assets/ce639a7e-672f-4ccb-a0d8-fc589461ecd7" />


- **Task Forms**: <img width="1640" height="510" alt="Screenshot 2026-06-20 000359" src="https://github.com/user-attachments/assets/d940a437-0dc9-4f61-985c-1dfa72c876ec" />
