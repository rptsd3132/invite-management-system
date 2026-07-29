from pydantic import BaseModel


class GoogleAuthPayload(BaseModel):
    google_token: str | None = None
    google_access_token: str | None = None


class UserRegisterRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    identifier: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    first_name: str | None
    last_name: str | None
    username: str | None
    email: str
    role: str
    is_active: bool
    created_at: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
