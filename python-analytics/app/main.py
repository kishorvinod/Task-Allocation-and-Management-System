from fastapi import FastAPI

from app.routers.analytics_router import (
    router as analytics_router
)

app = FastAPI(
    title="Task Analytics Service"
)

app.include_router(
    analytics_router
)

@app.get("/")
def health():

    return {
        "service":
        "analytics",
        "status":
        "running"
    }