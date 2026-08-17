import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.template import list_templates, list_templates_by_user


async def _register_and_login(client) -> tuple[str, str]:
    suffix = uuid.uuid4().hex[:8]
    email = f"tpl-{suffix}@example.com"
    username = f"tpl_{suffix}"
    register_response = await client.post(
        "/api/auth/register",
        json={
            "first_name": "Template",
            "last_name": "User",
            "username": username,
            "email": email,
            "password": "password123",
        },
    )
    assert register_response.status_code == 200
    return register_response.json()["access_token"], email


DESIGN_SCHEMA = {
    "container_classes": "relative w-full max-w-md mx-auto",
    "background": "bg-white",
    "decorations": [],
    "typography": {
        "title_classes": "font-serif text-3xl",
        "accent_classes": "font-serif italic text-lg",
        "body_classes": "font-sans text-xs",
    },
    "required_fields": ["event_name"],
}


class TestTemplatesApi:
    @pytest.mark.asyncio
    async def test_list_templates_returns_200(self, client):
        response = await client.get("/api/templates")

        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_crud_list_templates_empty(self, db_session: AsyncSession):
        templates = await list_templates(db_session)

        assert templates == []

    @pytest.mark.asyncio
    async def test_create_template_requires_auth(self, client):
        response = await client.post(
            "/api/templates",
            json={
                "name": "My Design",
                "category": "Wedding",
                "design_schema": DESIGN_SCHEMA,
            },
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_create_template_owned_by_user(self, client):
        token, _ = await _register_and_login(client)

        response = await client.post(
            "/api/templates",
            json={
                "name": "My Design",
                "category": "Wedding",
                "design_schema": DESIGN_SCHEMA,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 201
        body = response.json()
        assert body["name"] == "My Design"
        assert body["category"] == "Wedding"
        assert body["design_schema"] == DESIGN_SCHEMA
        assert body["user_id"] is not None

    @pytest.mark.asyncio
    async def test_own_template_excluded_from_public_list(self, client):
        token, _ = await _register_and_login(client)

        await client.post(
            "/api/templates",
            json={
                "name": "Private Design",
                "category": "Birthday",
                "design_schema": DESIGN_SCHEMA,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        public_response = await client.get("/api/templates")
        assert public_response.status_code == 200
        assert public_response.json() == []

        mine_response = await client.get(
            "/api/templates/mine",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert mine_response.status_code == 200
        mine = mine_response.json()
        assert len(mine) == 1
        assert mine[0]["name"] == "Private Design"

    @pytest.mark.asyncio
    async def test_my_templates_require_auth(self, client):
        response = await client.get("/api/templates/mine")

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_crud_list_templates_by_user(self, db_session: AsyncSession):
        templates = await list_templates_by_user(db_session, uuid.uuid4())

        assert templates == []