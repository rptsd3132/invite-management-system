from pydantic import BaseModel


class GoogleAuthPayload(BaseModel):
    google_token: str | None = None
    google_access_token: str | None = None


class EmailPasswordPayload(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    is_active: bool
    created_at: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
