from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.core.security import create_access_token, create_refresh_token
from app.schemas.auth import AuthResponse, EmailPasswordPayload, GoogleAuthPayload, UserResponse
from app.services.auth_service import (
    authenticate_local_user,
    authenticate_or_create_google_user,
    register_local_user,
    verify_google_access_token,
    verify_google_id_token,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _build_auth_response(user) -> AuthResponse:
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            created_at=str(user.created_at),
        ),
    )


@router.post("/google", response_model=AuthResponse)
async def google_auth(
    payload: GoogleAuthPayload,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    if payload.google_access_token:
        try:
            user_info = await verify_google_access_token(payload.google_access_token)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google access token",
            )
        email = user_info.get("email")
    elif payload.google_token:
        try:
            id_info = verify_google_id_token(payload.google_token)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token",
            )
        email = id_info.get("email")
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No token provided",
        )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token missing email",
        )

    user = await authenticate_or_create_google_user(db, email)
    return _build_auth_response(user)


@router.post("/register", response_model=AuthResponse)
async def register(
    payload: EmailPasswordPayload,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    try:
        user = await register_local_user(db, payload.email, payload.password)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return _build_auth_response(user)


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: EmailPasswordPayload,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    try:
        user = await authenticate_local_user(db, payload.email, payload.password)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return _build_auth_response(user)
