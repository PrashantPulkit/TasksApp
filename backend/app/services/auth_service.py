from ..models.user import User
from .. import db

class AuthService:
    @staticmethod
    def register(data):
        if User.query.filter_by(email=data["email"]).first():
            return None, "User exists"

        user = User(
            username=data.get("username"),
            email=data["email"],
            role=data.get("role", "user")
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()
        return user, None

    @staticmethod
    def authenticate(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return None
        return user