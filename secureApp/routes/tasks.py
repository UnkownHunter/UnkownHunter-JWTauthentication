from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models import Task, User
from schemas import TaskResponse, TaskCreate, TaskUpdate
from utils.auth import JWTBearer, decodeJWT

route = APIRouter(prefix="/tasks", tags=["Tasks"])

def get_current_user_from_token(token: str = Depends(JWTBearer()), db: Session = Depends(get_db)) -> User:
    """
    Get current user safely from JWT token
    """
    payload = decodeJWT(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or expired token",
        )
    user_id = payload.get("sub")
    
    # We used string for subject in auth.py
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@route.get("/", response_model=List[TaskResponse])
def get_user_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    return tasks

@route.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        owner_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@route.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.title = task_update.title
    db_task.description = task_update.description
    db_task.status = task_update.status
    
    db.commit()
    db.refresh(db_task)
    return db_task

@route.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}
