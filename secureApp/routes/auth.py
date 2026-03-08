from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from utils.auth import get_user, create_user, create_access_token, create_refresh_token
from schemas import GetUser, PostUser, LoginUser
from datetime import timedelta

route = APIRouter(prefix="/auth", tags=["Authentication"])

@route.post("/register", response_model=GetUser)
def register_user(payload: PostUser, db: Session = Depends(get_db)):
    if not payload.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a username",
        )
    user = get_user(db, payload.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with username {payload.username} already exists",
        )
    user = create_user(db, payload)
    return user


@route.post("/login")
def login_user(payload: LoginUser, db: Session = Depends(get_db)):
    """
    Login user based on username and password
    """
    if not payload.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a username",
        )
    
    user = get_user(db, payload.username)
    if not user or not user.check_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
        
    token = create_access_token(user.id, timedelta(minutes=30)) 
    refresh = create_refresh_token(user.id, timedelta(minutes=1008))

    # The frontend expects { access_token, user: { id, username, role } }
    return {
        'access_token': token, 
        'token_type': 'bearer',
        'refresh_token': refresh,
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }
    }
