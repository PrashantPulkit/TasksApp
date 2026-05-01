from ..models.task import Task
from .. import db

class TaskService:
    @staticmethod
    def get_user_tasks(user_id):
        return Task.query.filter_by(user_id=user_id).all()

    @staticmethod
    def create_task(data, user_id):
        task = Task(
            title=data.get("title"),
            description=data.get("description"),
            user_id=user_id
        )
        db.session.add(task)
        db.session.commit()
        return task

    @staticmethod
    def update_task(task, data):
        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        db.session.commit()
        return task

    @staticmethod
    def delete_task(task):
        db.session.delete(task)
        db.session.commit()