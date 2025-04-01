from pydantic import BaseModel, EmailStr, constr
from typing import Optional


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    grade: Optional[str] = None
    school: Optional[str] = None
    avatar: Optional[bytes] = None
    email: EmailStr
    password: constr(min_length=8)
    password_confirmation: str

    class Config:
        from_attributes = True


class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: Optional[int]
    grade: Optional[str]
    school: Optional[str]
    email: EmailStr

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    question: str
    answer: str


class Task(BaseModel):
    id: int
    question: str
    answer: str

    class Config:
        from_attributes = True