import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import create_user
from app.models.user import User


class TestGoogleAuth:

    @pytest.mark.asyncio
    async def test_token_verification_failure(
        self,
        client: AsyncClient,
        mock_verify_google_token,
    ):
        mock_verify_google_token.side_effect = ValueError("Invalid token")

        response = await client.post("/api/auth/google", json={"google_token": "invalid-token"})

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid Google token"

    @pytest.mark.asyncio
    async def test_existing_user_sso_login(
        self,
        client: AsyncClient,
        db_session: AsyncSession,
        mock_verify_google_token,
    ):
        await create_user(
            db=db_session,
            email="existing@example.com",
            hashed_password=None,
            auth_provider="google",
        )

        mock_verify_google_token.return_value = {
            "email": "existing@example.com",
            "email_verified": True,
        }

        response = await client.post("/api/auth/google", json={"google_token": "valid-token"})

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "existing@example.com"
        assert data["user"]["role"] == "organizer"

    @pytest.mark.asyncio
    async def test_new_user_sso_provisioning(
        self,
        client: AsyncClient,
        db_session: AsyncSession,
        mock_verify_google_token,
    ):
        mock_verify_google_token.return_value = {
            "email": "newuser@example.com",
            "email_verified": True,
        }

        response = await client.post("/api/auth/google", json={"google_token": "valid-token"})

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

        result = await db_session.execute(
            select(User).where(User.email == "newuser@example.com")
        )
        user = result.scalar_one_or_none()
        assert user is not None
        assert user.hashed_password is None
        assert user.auth_provider == "google"


class TestGoogleAccessTokenFlow:

    @pytest.mark.asyncio
    async def test_access_token_verification_failure(
        self,
        client: AsyncClient,
        mock_verify_google_access_token,
    ):
        mock_verify_google_access_token.side_effect = ValueError("Invalid token")

        response = await client.post(
            "/api/auth/google", json={"google_access_token": "invalid-token"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid Google access token"

    @pytest.mark.asyncio
    async def test_existing_user_login(
        self,
        client: AsyncClient,
        db_session: AsyncSession,
        mock_verify_google_access_token,
    ):
        await create_user(
            db=db_session,
            email="existing@example.com",
            hashed_password=None,
            auth_provider="google",
        )

        mock_verify_google_access_token.return_value = {
            "email": "existing@example.com",
        }

        response = await client.post(
            "/api/auth/google", json={"google_access_token": "valid-token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "existing@example.com"
        assert data["user"]["role"] == "organizer"

    @pytest.mark.asyncio
    async def test_new_user_provisioning(
        self,
        client: AsyncClient,
        db_session: AsyncSession,
        mock_verify_google_access_token,
    ):
        mock_verify_google_access_token.return_value = {
            "email": "newuser@example.com",
        }

        response = await client.post(
            "/api/auth/google", json={"google_access_token": "valid-token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

        result = await db_session.execute(
            select(User).where(User.email == "newuser@example.com")
        )
        user = result.scalar_one_or_none()
        assert user is not None
        assert user.hashed_password is None
        assert user.auth_provider == "google"

    @pytest.mark.asyncio
    async def test_missing_token_returns_400(
        self,
        client: AsyncClient,
    ):
        response = await client.post("/api/auth/google", json={})
        assert response.status_code == 400
        assert response.json()["detail"] == "No token provided"
