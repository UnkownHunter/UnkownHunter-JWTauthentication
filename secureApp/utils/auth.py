from sqlalchemy.orm import Session
from utils.password import secure_pwd
from models import *
from schemas import *
from fastapi import HTTPException, status, Request
from config import setting
from datetime import date, datetime, timedelta, time
from typing import Union, Any, Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError

def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=setting.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, setting.secret_key, setting.algorithm)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=setting.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, setting.refresh_secret_key, setting.algorithm)
    return encoded_jwt

def decodeJWT(jwtoken: str):
    try:
        payload = jwt.decode(jwtoken,setting.secret_key, setting.algorithm)
        return payload
    except JWTError:
        return None


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            token = credentials.credentials
            if not self.verify_jwt(token):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return token
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            payload = decodeJWT(jwtoken)
            return True
        except ExpiredSignatureError:
            return False
        except JWTError:
            return False

def get_user(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, payload: PostUser) -> User:
    new_user = User(
        username=payload.username,
        role="user"
    )
    new_user.set_password(payload.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user