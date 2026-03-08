from pydantic import BaseModel, Field
from typing import Optional, List

class GetUser(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

class LoginUser(BaseModel):
    username: str
    password: str

class PostUser(BaseModel):
    username: str
    password: str

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: str
    status: str = "Pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True