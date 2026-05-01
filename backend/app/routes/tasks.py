from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models.task import Task
from ..services.task_service import TaskService
from ..schemas.task_schema import TaskSchema
from ..utils.decorators import role_required

tasks_bp = Blueprint("tasks", __name__)

task_schema = TaskSchema()


@tasks_bp.route("/", methods=["GET"])
@jwt_required()
def get_tasks():
    """
    Get Tasks
    ---
    tags:
        - Tasks
    security:
        - Bearer: []
    responses:
        200:
            description: List of tasks
    """
    user_id = get_jwt_identity()
    tasks = TaskService.get_user_tasks(user_id)

    return jsonify([{ "id": t.id, "title": t.title } for t in tasks])


@tasks_bp.route("/", methods=["POST"])
@jwt_required()
def create_task():
    """
Create Task
---
tags:
  - Tasks
parameters:
  - in: body
    name: body
    required: true
    schema:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
security:
  - Bearer: []
responses:
  201:
    description: Task created
"""
    try:
        data = task_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user_id = get_jwt_identity()
    TaskService.create_task(data, user_id)
    return jsonify({"message": "Task created"}), 201


@tasks_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_task(id):
    """
    Update Task
    ---
    tags:
        - Tasks
    security:
        - Bearer: []
    responses:
        200:
            description: Task updated
    """
    user_id = get_jwt_identity()
    task = Task.query.get_or_404(id)

    if task.user_id != user_id:
        return jsonify({"message": "Forbidden"}), 403

    try:
        data = task_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    TaskService.update_task(task, data)
    return jsonify({"message": "Updated"})


@tasks_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_task(id):
    """
    Delete Task (Admin only)
    ---
    tags:
        - Tasks
    security:
        - Bearer: []
    responses:
        200:
            description: Task deleted
    """
    task = Task.query.get_or_404(id)
    TaskService.delete_task(task)
    return jsonify({"message": "Deleted"})

