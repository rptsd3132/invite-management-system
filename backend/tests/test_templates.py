import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.template import list_templates


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