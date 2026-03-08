## 

### **Assignment Overview**

You will build a **Scalable REST API with Authentication & Role-Based Access**, and create a **simple frontend UI** for testing your APIs, within **3 days**.

---

### **Core Features to Implement**

✅ **Backend (Primary Focus)**

- User registration & login APIs with password hashing and JWT authentication
- Role-based access (user vs admin)
- CRUD APIs for a secondary entity (e.g., tasks, notes, or products)
- API versioning, error handling, validation
- API documentation (Swagger/Postman)
- Database schema (Postgres/MySQL/MongoDB)

✅ **Basic Frontend (Supportive)**

- Build with **React.js / Next.js / Vanilla JS**
- Simple UI to:
    - Register & log in users
    - Access protected dashboard (JWT required)
    - Perform CRUD actions on the entity
- Show error/success messages from API responses

✅ **Security & Scalability**

- Secure JWT token handling
- Input sanitization & validation
- Scalable project structure for new modules
- Optional: caching (Redis), logging, or Docker deployment

---

### **Deliverables**

1. Backend project hosted in GitHub with README.md setup
2. Working APIs for authentication & CRUD
3. Basic frontend UI that connects to your APIs
4. API documentation (Swagger/Postman collection)
5. Short scalability note (e.g., microservices, caching, load balancing)

---

### **Evaluation Criteria**

- ✅ API design (REST principles, status codes, modularity)
- ✅ Database schema design & management
- ✅ Security practices (JWT handling, hashing, validation)
- ✅ Functional frontend integration
- ✅ Scalability & deployment readiness

### **File structure** 

project/
│
│ ── __init__.py
│ ── main.py
│ ── db.py # Database configuration and session handling
│ ── models.py # SQLAlchemy models or create RAW queries for interaction with database
│ ── schemas.py # Pydantic schemas
│ ── utils/
│ ├── password.py
│ └── auth.py. # JWT authentication functions
│ ── routes/
│ └── auth.py # Authentication routes
├── .env # Environment variables├── requirements.txt # Python dependencies
├── config.py. # .env linking
├── requirements.txt. # Python dependencies
└── optional — run.py. # Script to run the FastAPI application