TaskFlow - Full-Stack MERN Task Management System

TaskFlow is a robust and intuitive full-stack task management application built with the MERN stack. It provides a seamless experience for individuals and teams to organize, track, and manage their workflows through an interactive Kanban-style board. The application features secure user authentication, role-based access control, and a clean, responsive user interface.

Live Demo: your-live-demo-link.com
 (Replace with your actual demo link)

✨ Features

Secure User Authentication: JWT-based authentication for user registration and login. Passwords are securely hashed.

Full CRUD Functionality: Create, Read, Update, and Delete tasks with ease.

Interactive Kanban Board: Drag-and-drop tasks between columns (e.g., 'To Do', 'In Progress', 'Done') to visually manage workflows.

Role-Based Access Control (RBAC):

Standard User: Can manage their own assigned tasks.

Admin: Can view an admin dashboard, manage all users, and oversee all tasks in the system.

Protected Routes: Secure client-side and server-side routes to prevent unauthorized access.

Responsive Design: Seamless experience across desktop, tablet, and mobile devices.

Pagination: Efficiently handles large numbers of tasks and users without sacrificing performance.

Centralized API Management: Clean and organized way to handle all frontend API requests.

🛠️ Technology Stack

Backend

Node.js: JavaScript runtime environment

Express.js: Web framework for building RESTful APIs

MongoDB: NoSQL database for storing user and task data

Mongoose: ODM library for MongoDB

JSON Web Token (JWT): Secure authentication

bcryptjs: Hashing passwords

dotenv: Environment variables

Frontend

React: JavaScript library for UI

React Router: Client-side routing

React Context API: Global state management

Axios: HTTP requests

CSS: Custom styling (Register.css, App.css, index.css)

📋 API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new user	Public
POST	/api/auth/login	Authenticate a user and get JWT	Public
GET	/api/tasks	Get all tasks for logged-in user	Private
POST	/api/tasks	Create a new task	Private
GET	/api/tasks/:id	Get a single task by ID	Private
PUT	/api/tasks/:id	Update an existing task	Private
DELETE	/api/tasks/:id	Delete a task	Private
GET	/api/users	Get all users (Admin only)	Admin
🌱 Future Enhancements

Real-time Updates: Integrate WebSockets for live collaboration

Notifications: Email or in-app notifications for task assignments and deadlines

File Attachments: Upload and attach files to tasks

Comments and Mentions: Add commenting system with @-mentions

Advanced Reporting: Analytics dashboard for project insights

📂 Project Structure
Task-Management/
├── Backend/                        
│   ├── config/                     # Configuration files
│   │   └── db.js                   # MongoDB database connection
│   ├── controllers/                
│   │   ├── authControllers.js      # Auth logic (login/register)
│   │   └── taskControllers.js      # Task CRUD logic
│   ├── middleware/                 
│   │   ├── auth.js                 # JWT auth middleware
│   │   └── adminOnly.js            # Admin access control
│   ├── models/                      
│   │   ├── Task.js                  
│   │   └── User.js                  
│   ├── routes/                      
│   │   ├── auth.js                  
│   │   └── tasks.js                 
│   ├── utils/                       
│   │   └── helper.js                
│   ├── .env                         
│   ├── package.json                 
│   └── index.js                     
│
├── Frontend/                        
│   ├── src/
│   │   ├── api/                     
│   │   │   └── api.js               
│   │   ├── components/              
│   │   │   ├── Navbar.jsx           
│   │   │   ├── TaskBoard.jsx        
│   │   │   ├── TaskCard.jsx         
│   │   │   ├── TaskColumn.jsx       
│   │   │   ├── TaskForm.jsx         
│   │   │   ├── Pagination.jsx       
│   │   │   └── ProtectedRoute.jsx   
│   │   ├── context/                 
│   │   │   └── AuthContext.jsx      
│   │   ├── pages/                    
│   │   │   ├── Dashboard.jsx         
│   │   │   ├── AdminDashboard.jsx    
│   │   │   ├── Login.jsx             
│   │   │   ├── Register.jsx          
│   │   │   ├── Users.jsx             
│   │   │   └── TaskDetails.jsx       
│   │   ├── assets/                   
│   │   ├── App.jsx                    
│   │   ├── main.jsx                   
│   │   └── helper.js                  
│   ├── .env                          
│   ├── package.json                  
│   └── vite.config.js                
│
├── .gitignore                        
├── README.md                         
└── package.json                       

👤 Author

Nishant Kumar

GitHub: [@nishant443](https://github.com/nishant443)

LinkedIn: Nishant Singh
