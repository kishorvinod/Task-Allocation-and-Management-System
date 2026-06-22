from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.analytics_router import (
    router as analytics_router
)

app = FastAPI(
    title="Task Analytics Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
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
