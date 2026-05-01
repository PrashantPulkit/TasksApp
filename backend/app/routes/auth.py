from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError
from ..services.auth_service import AuthService
from ..schemas.user_schema import RegisterSchema, LoginSchema

auth_bp = Blueprint("auth", __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = register_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user, error = AuthService.register(data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({"message": "User created"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = login_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user = AuthService.authenticate(data.get("email"), data.get("password"))

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id, additional_claims={"role": user.role})

    return jsonify({"access_token": token})