from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Invalid input"}), 400

    user, error = AuthService.register(data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({"message": "User created"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = AuthService.authenticate(data.get("email"), data.get("password"))

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id, additional_claims={"role": user.role})

    return jsonify({"access_token": token})
