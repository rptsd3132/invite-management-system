import uuid

import pytest


class TestLocalAuth:
    @pytest.mark.asyncio
    async def test_register_and_login(self, client):
        suffix = uuid.uuid4().hex[:8]
        email = f"local-{suffix}@example.com"
        username = f"user_{suffix}"

        register_response = await client.post(
            "/api/auth/register",
            json={
                "first_name": "Test",
                "last_name": "User",
                "username": username,
                "email": email,
                "password": "password123",
            },
        )

        assert register_response.status_code == 200
        user = register_response.json()["user"]
        assert user["email"] == email
        assert user["username"] == username
        assert user["first_name"] == "Test"
        assert user["last_name"] == "User"

        login_response = await client.post(
            "/api/auth/login",
            json={"identifier": email, "password": "password123"},
        )

        assert login_response.status_code == 200
        assert login_response.json()["user"]["email"] == email

        # Login by username should also work
        login_by_username = await client.post(
            "/api/auth/login",
            json={"identifier": username, "password": "password123"},
        )

        assert login_by_username.status_code == 200
        assert login_by_username.json()["user"]["email"] == email

    @pytest.mark.asyncio
    async def test_login_rejects_bad_password(self, client):
        suffix = uuid.uuid4().hex[:8]
        email = f"badpass-{suffix}@example.com"

        await client.post(
            "/api/auth/register",
            json={
                "first_name": "Bad",
                "last_name": "Pass",
                "username": f"badpass_{suffix}",
                "email": email,
                "password": "password123",
            },
        )

        response = await client.post(
            "/api/auth/login",
            json={"identifier": email, "password": "wrong-password"},
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client):
        suffix = uuid.uuid4().hex[:8]
        email = f"dup-{suffix}@example.com"

        await client.post(
            "/api/auth/register",
            json={
                "first_name": "First",
                "last_name": "User",
                "username": f"dup1_{suffix}",
                "email": email,
                "password": "password123",
            },
        )

        response = await client.post(
            "/api/auth/register",
            json={
                "first_name": "Second",
                "last_name": "User",
                "username": f"dup2_{suffix}",
                "email": email,
                "password": "password456",
            },
        )

        assert response.status_code == 409
        assert "Email already registered" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_register_duplicate_username(self, client):
        suffix = uuid.uuid4().hex[:8]
        username = f"dupuser_{suffix}"

        await client.post(
            "/api/auth/register",
            json={
                "first_name": "First",
                "last_name": "User",
                "username": username,
                "email": f"first-{suffix}@example.com",
                "password": "password123",
            },
        )

        response = await client.post(
            "/api/auth/register",
            json={
                "first_name": "Second",
                "last_name": "User",
                "username": username,
                "email": f"second-{suffix}@example.com",
                "password": "password456",
            },
        )

        assert response.status_code == 409
        assert "Username already taken" in response.json()["detail"]
