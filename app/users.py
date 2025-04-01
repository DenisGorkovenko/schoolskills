from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.utility import get_password_hash
from database import get_db, SessionLocal

import schemas
import models

router = APIRouter()


# Получение всех пользователей из базы данных
@router.get('/api/users/', response_model=List[schemas.User])
def get_all_users(db: SessionLocal = Depends(get_db)):
    users = db.query(models.User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users


# Регистрация нового пользователя и запись в базу данных
@router.post('/api/users/', status_code=status.HTTP_201_CREATED)
def create_users(user: schemas.UserCreate, db: SessionLocal = Depends(get_db)):
    exists = (db.query(models.User).filter(models.User.email == user.email).all())
    if len(exists) > 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Пользователь с таким email уже существует!',
        )

    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        age=user.age,
        grade=user.grade,
        school=user.school,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
