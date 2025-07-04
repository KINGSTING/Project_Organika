from flask import Flask
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config

metadata = MetaData(schema="public")
db = SQLAlchemy(metadata=metadata)
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    print("Connected to DB:", app.config["SQLALCHEMY_DATABASE_URI"])

    db.init_app(app)
    jwt.init_app(app)

    # ✅ Enable CORS globally (do NOT comment this out)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    from .routes.auth_routes import auth_bp
    from .routes.plantilla_routes import plantilla_bp
    from .routes.employee_routes import employee_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(plantilla_bp, url_prefix="/plantilla")
    app.register_blueprint(employee_bp, url_prefix="/employees")

    return app
