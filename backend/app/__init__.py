from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from .config import Config
from flask_cors import CORS
db = SQLAlchemy()
jwt = JWTManager()
swagger = Swagger()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    swagger.init_app(app)

    from .routes.auth import auth_bp
    from .routes.tasks import tasks_bp

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/v1/tasks")

    with app.app_context():
        db.create_all()
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    return app