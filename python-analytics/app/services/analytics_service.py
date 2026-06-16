from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.database import db


class AnalyticsService:

    @staticmethod
    def workload_summary() -> List[Dict[str, Any]]:
        users = list(
            db.users.find({
                "role": {"$ne": "admin"}
            })
        )
        result = []

        for user in users:
            assigned_tasks = list(
                db.tasks.find({"assignedUser": user["_id"]})
            )

            allocated_hours = sum(
                task.get("estimatedHours", 0) for task in assigned_tasks
            )

            available_hours = (
                user.get("availableHoursPerDay", 0)
                * len(user.get("workingDays", []))
            )

            result.append({
                "userId": str(user["_id"]),
                "name": user.get("name"),
                "availableHours": available_hours,
                "allocatedHours": allocated_hours,
                "remainingHours": available_hours - allocated_hours,
                "taskCount": len(assigned_tasks),
            })

        return result

    @staticmethod
    def overloaded_users() -> List[Dict[str, Any]]:
        users = AnalyticsService.workload_summary()

        return [
            user for user in users
            if user["allocatedHours"] > user["availableHours"]
        ]

    @staticmethod
    def underutilized_users() -> List[Dict[str, Any]]:
        users = AnalyticsService.workload_summary()
        result = []

        for user in users:
            available = user["availableHours"]
            allocated = user["allocatedHours"]

            if available == 0:
                continue

            utilization = (allocated / available) * 100

            if utilization < 50:
                user["utilization"] = round(utilization, 2)
                result.append(user)

        return result

    @staticmethod
    def tasks_at_risk() -> List[Dict[str, Any]]:
        today = datetime.utcnow()
        threshold = today + timedelta(days=3)

        tasks = list(
            db.tasks.find({
                "status": {"$ne": "Completed"},
                "dueDate": {"$lte": threshold}
            })
        )

        result = []

        for task in tasks:
            due_date = task.get("dueDate")

            days_remaining = (
                (due_date - today).days if due_date else None
            )

            result.append({
                "taskId": str(task["_id"]),
                "title": task.get("title"),
                "status": task.get("status"),
                "dueDate": due_date,
                "daysRemaining": days_remaining,
            })

        return result

    @staticmethod
    def skill_demand() -> List[Dict[str, Any]]:
        tasks = list(
            db.tasks.aggregate([
                {
                    "$group": {
                        "_id": "$requiredSkill",
                        "tasks": {"$sum": 1}
                    }
                }
            ])
        )

        result = []

        for task in tasks:
            skill = task["_id"]

            user_count = db.users.count_documents({
                "role": {"$ne": "admin"},
                "skills": skill
            })

            result.append({
                "skill": skill,
                "users": user_count,
                "tasks": task["tasks"],
            })

        return result

    @staticmethod
    def task_completion_summary() -> Dict[str, Any]:
        total = db.tasks.count_documents({})
        completed = db.tasks.count_documents({"status": "Completed"})
        pending = db.tasks.count_documents({"status": "Pending"})
        in_progress = db.tasks.count_documents({"status": "In Progress"})

        completion_rate = (completed / total * 100) if total > 0 else 0

        return {
            "totalTasks": total,
            "completedTasks": completed,
            "pendingTasks": pending,
            "inProgressTasks": in_progress,
            "completionRate": round(completion_rate, 2),
        }

    @staticmethod
    def priority_workload() -> List[Dict[str, Any]]:
        return list(
            db.tasks.aggregate([
                {
                    "$group": {
                        "_id": "$priority",
                        "tasks": {"$sum": 1},
                        "estimatedHours": {"$sum": "$estimatedHours"},
                    }
                }
            ])
        )

    @staticmethod
    def estimated_hours_by_status() -> List[Dict[str, Any]]:
        return list(
            db.tasks.aggregate([
                {
                    "$group": {
                        "_id": "$status",
                        "hours": {"$sum": "$estimatedHours"},
                    }
                }
            ])
        )
