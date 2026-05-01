from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..models.user import User
from .. import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Invalid input"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User exists"}), 400

    user = User(
        username=data.get("username"),
        email=data["email"],
        role=data.get("role", "user")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id, additional_claims={"role": user.role})

    return jsonify({"access_token": token})