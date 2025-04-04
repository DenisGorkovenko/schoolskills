from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional

import base64
import config

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


def decode_image(b64_avatar):
    return base64.b64decode(b64_avatar.split(',')[1])


def encode_image(byte_avatar):
    avatar = base64.b64encode(byte_avatar).decode("utf-8") if byte_avatar else ''
    return f"data:image/png;base64,{avatar}" if avatar else ''
