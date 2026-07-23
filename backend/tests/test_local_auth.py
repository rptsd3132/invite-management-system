import uuid

import pytest


class TestLocalAuth:
    @pytest.mark.asyncio
    async def test_register_and_login(self, client):
        email = f"local-{uuid.uuid4().hex[:8]}@example.com"

        register_response = await client.post(
            "/api/auth/register",
            json={"email": email, "password": "password123"},
        )

        assert register_response.status_code == 200
        assert register_response.json()["user"]["email"] == email

        login_response = await client.post(
            "/api/auth/login",
            json={"email": email, "password": "password123"},
        )

        assert login_response.status_code == 200
        assert login_response.json()["user"]["email"] == email

    @pytest.mark.asyncio
    async def test_login_rejects_bad_password(self, client):
        await client.post(
            "/api/auth/register",
            json={"email": "badpass@example.com", "password": "password123"},
        )

        response = await client.post(
            "/api/auth/login",
            json={"email": "badpass@example.com", "password": "wrong-password"},
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid email or password"