import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine
from routes import auth, tasks

# Initialize the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PrimeTask API")

# Configure CORS to allow our React app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our routers
app.include_router(auth.route)
app.include_router(tasks.route)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "API is running"}