from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    from .routes.auth_routes import auth_bp
    from .routes.plantilla_routes import plantilla_bp
    from .routes.employee_routes import employee_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(plantilla_bp, url_prefix="/plantilla")
    app.register_blueprint(employee_bp, url_prefix="/employees")

    return app
