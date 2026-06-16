from fastapi import APIRouter

from app.services.analytics_service import (
    AnalyticsService
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get(
    "/workload-summary"
)
def workload_summary():
    return AnalyticsService\
        .workload_summary()


@router.get(
    "/overloaded-users"
)
def overloaded_users():
    return AnalyticsService\
        .overloaded_users()


@router.get(
    "/underutilized-users"
)
def underutilized_users():
    return AnalyticsService\
        .underutilized_users()


@router.get(
    "/tasks-at-risk"
)
def tasks_at_risk():
    return AnalyticsService\
        .tasks_at_risk()


@router.get(
    "/skill-demand"
)
def skill_demand():
    return AnalyticsService\
        .skill_demand()


@router.get(
    "/task-completion-summary"
)
def completion_summary():
    return AnalyticsService\
        .task_completion_summary()


@router.get(
    "/priority-workload"
)
def priority_workload():
    return AnalyticsService\
        .priority_workload()


@router.get(
    "/hours-by-status"
)
def hours_by_status():
    return AnalyticsService\
        .estimated_hours_by_status()