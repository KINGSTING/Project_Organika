import os
from dotenv import load_dotenv
import cloudinary

load_dotenv()  # Load environment variables from .env

class Config:
    # Load database URL from env and normalize format for SQLAlchemy
    database_url = os.getenv("DATABASE_URL", "").strip()
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    if not database_url:
        raise ValueError("❌ DATABASE_URL is not set in the environment variables.")

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")

# ✅ Configure Cloudinary globally
cloudinary.config(
    secure=True  # Optional: force https
)
