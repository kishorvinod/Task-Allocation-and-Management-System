from fastapi import FastAPI

from app.analytics import get_workload_summary

app = FastAPI(
    title="Analytics Service"
)

@app.get("/analytics/workload")
def workload():
    return get_workload_summary()