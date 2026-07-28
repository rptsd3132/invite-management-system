from celery import Celery


celery_app = Celery(
    "invite_management_system",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
)
