from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from app.utility import get_password_hash, verify_password, create_access_token, encode_image, decode_image
from database import get_db, SessionLocal
from jose import jwt, JWTError

import schemas
import models
import config

import logging

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/users/token/login_user/')


async def get_current_user(token: str = Depends(oauth2_scheme), db: SessionLocal = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=config.ALGORITHM)
        email: str = payload.get('sub')
        if email is None:
            raise credentials_exception

    except JWTError as e:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise credentials_exception

    return user


def get_response_user(user):
    return schemas.UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        age=user.age,
        grade=user.grade,
        school=user.school,
        email=user.email,
        rating=user.rating,
        avatar=encode_image(user.avatar)
    )


# Получение всех пользователей из базы данных
@router.get('/get_all_users/', response_model=List[schemas.UserGet])
def get_all_users(db: SessionLocal = Depends(get_db)):
    users = db.query(models.User).all()
    if not users:
        raise HTTPException(status_code=404, detail='Нет ни одного зарегистрированного пользователя')
    return users


# Регистрация нового пользователя и запись в базу данных
@router.post('/create_users/', status_code=status.HTTP_201_CREATED)
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


# Аутентификация пользователя и получение токена
@router.post('/token/login_user/', response_model=schemas.Token)
def login_user(login_request: schemas.LoginRequest, db: SessionLocal = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_request.email).first()
    if not user or not verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Неверный адрес электронной почты или пароль',
        )
    access_token = create_access_token(data={'sub': user.email})
    return {'auth_token': access_token, 'token_type': 'Bearer'}


# Выход из системы
@router.post('/token/logout_user/')
def logout_user():
    return {'message': 'Успешно'}


# Возвращает авторизованного пользователя
@router.get('/me/', response_model=schemas.UserResponse)
def get_current_profile_user(current_user: models.User = Depends(get_current_user)):
    return get_response_user(current_user)


# Изменение аватара
@router.put('/me/avatar/')
def update_avatar(avatar_data: schemas.AvatarUpload,
                  current_user: models.User = Depends(get_current_user),
                  db: SessionLocal = Depends(get_db)):
    try:
        decoded_file = decode_image(avatar_data.avatar)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail='Invalid string'
        )
    current_user.avatar = decoded_file
    db.commit()
    return {'message': 'Аватар успешно изменен!'}


# Удаление аватара
@router.delete('/me/avatar/')
def delete_avatar(current_user: models.User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    current_user.avatar = None
    db.commit()
    return {'message': 'Аватар удален!'}
